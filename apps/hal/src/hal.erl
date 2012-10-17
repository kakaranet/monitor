-module(hal).
-behaviour(snmpm_user).
-include_lib("inets/include/httpd.hrl").
-include_lib("snmp/include/STANDARD-MIB.hrl").
-include("hal.hrl").

-export([handle_error/3, handle_agent/5, handle_pdu/4, handle_trap/3, handle_inform/3, handle_report/3]).
-export([home/3, snmp/3]).

snmp(SessionId, Env, _Input) ->
    mod_esi:deliver(SessionId, ["Content-Type:application/json\r\n\r\n" |
    mochijson2:encode({struct, [{disks, lists:flatten([disk_info(Agent) || Agent <- snmpm:which_agents(), Agent=:=agent_id(Env)])}] })]).

home(SessionId, Env, _Input) ->
    mod_esi:deliver(SessionId, ["Content-Type:text/html\r\n\r\n" | home(Env)]).

home([{http_host, Host} | _Env]) ->
    "<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"http://"++Host++"/hal.css\" />"++
    "<script type=\"text/javascript\" src=\"http://"++ Host++"/jquery.js\"></script>"++
    "<script>function comet(el){$.ajax({ type: 'Get', url: 'http://"++Host++"/monitor/hal:snmp?id=' + $(el).attr('id'), async: true, cache: false, dataType: \"json\","++
    "success : function(jsonData){ for (id in jsonData) { if(jsonData.hasOwnProperty(id)){ $(el).removeClass(function(){$(this).attr('class')}); $(el).addClass(id);} }"++ 
    "var ctx = $(el)[0].getContext(\"2d\");ctx.fillStyle=\"#a5AA22\";ctx.fillRect(0,0,200,200);ctx.font=\"bold 45px Ubuntu\";"++
    "ctx.fillStyle=\"#FFFFFF\";ctx.fillText(\"DSK\",70,140); ctx.fillStyle=\"#FFFFFF\"; ctx.font=\"bold 13px Ubuntu\";"++
    "ctx.fillText(\"№   Mount    Size, Kb    Use,%\", 10, 20);ctx.fillStyle=\"#FFFFFF\"; ctx.font=\"bold 11px Ubuntu\";"++
    "$.each(jsonData.disks, function(i, disk){"++
    "var y = i*13 + 35; ctx.fillText(i, 12, y); ctx.fillText(disk.mount, 33, y);ctx.fillText(disk.size, 88, y);ctx.fillText(disk.use, 152, y);});"++
    "ctx.strokeStyle=\"#FFFFFF\";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(10,23);ctx.lineTo(23, 23);ctx.moveTo(34,23);ctx.lineTo(76, 23);ctx.moveTo(88,23);ctx.lineTo(139, 23);"++
    "ctx.moveTo(151,23);ctx.lineTo(187, 23);ctx.closePath();ctx.stroke();"++
    "ctx.fillStyle=\"#FFFFFF\";ctx.font=\"bold 15px Ubuntu\";ctx.fillText($(el).attr(\"id\"),10,155);"++
    "setTimeout(function(){comet(el);el=null}, 1000)}," ++
    "error: function(XMLHttpRequest, textStatus, error){ $(el).html(textStatus), setTimeout(function(){comet(el);el=null}, 5000);}});}" ++
    "$(function(){$.map($(\"canvas\"), function(el, i){comet(el)});});</script></head><body>"++
    "<div id=\"content\"><ul>"
    "<li><canvas id=\"app\" width=\"200\" height=\"200\" class=\"node\"></canvas></li>"++
    "<li><canvas id=\"game\" width=\"200\" height=\"200\" class=\"node\"></canvas></li>"++
    "<li><canvas id=\"web\" width=\"200\" height=\"200\" class=\"node\">Hello web</canvas></li>"++
    "<li><canvas id=\"rabbit\" width=\"200\" height=\"200\" class=\"node\"></canvas></li>"++
    "</ul></div></body></html>";
home([{_, _} | Env]) ->
    home(Env).

% Info 
disk_info(Agent)->
    [prepare_disk_json(D) || D <- get_row(?diskTableEntry, ?diskTableRow, Agent, []), D/=[], validate_disk_row(D)/=[]].

prepare_disk_json([{_, Mount},{_, Size},{_, Use}])->
    {struct, [{mount, iolist_to_binary(Mount)}, {size, Size}, {use, Use}]}.

% snmp
get_row(_Prefix, [], _Agent, Acc)-> Acc;
get_row(Prefix, Oids, Agent, Acc) ->
    case snmpm:sync_get_next("kakauser", Agent, Oids) of
	{ok, {_Es, _Ei, Vb}, _R} -> 
	    Resp = validate_oids([{Oid, Value} || {varbind, Oid, _Tp, Value, _Rid} <- Vb, lists:prefix(Prefix, Oid)=:=true], length(Oids)),
	    NextOids = [Oid || {Oid, _} <- Resp];
	{error, Reason} ->
	    Resp =[],
	    NextOids=[],
	    error_log:error_msg("SNMP request failed: ~p~n", [Reason])
    end,
    get_row(Prefix, NextOids, Agent, [Resp|Acc]).

handle_error(_ReqId, _Reason, _UserData) -> ignore. % Ignore errors
handle_agent(_Addr, _Port, _Type, _SnmpInfo, _UserData) -> ignore. % Ignore an unknown  agents
handle_pdu(_TargetName, _ReqId, _SnmpPduInfo, _UserData) -> ignore. % Ignore async request
handle_trap(_TargetName, _SnmpTrapInfo, _UserData) -> ignore. % Ignore notification
handle_inform(_TargetName, _SnmpInformInfo, _UserData) -> ignore. % Ignore info messges
handle_report(_TargetName, _SnmpReportInfo, _UserData) -> ignore. % Ignore reports

% Utils TODO: consider refactoring
validate_disk_row(D = [{?diskMount++[?diskEntryNo,_], _},{?diskSize++[?diskEntryNo,_], _},{?diskUse++[?diskEntryNo,_], _}])-> D; % Take 1st entry
validate_disk_row(_)-> [].

validate_oids(Vbs, L) when length(Vbs) =:= L -> Vbs;
validate_oids(_, _) -> [].

agent_id([])-> ok;
agent_id([{query_string, Str} | _])->
    lists:nth(1, string:tokens(Str, "id= &_="));
agent_id([{_,_}|Env])->
    agent_id(Env).
