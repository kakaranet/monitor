-module(hal).
-behaviour(snmpm_user).
-include_lib("inets/include/httpd.hrl").
-include_lib("snmp/include/STANDARD-MIB.hrl").
-include("../include/OTP-OS-MON-MIB.hrl").
-include("../include/OTP-MIB.hrl").
-include("../include/hal.hrl").

-export([handle_error/3, handle_agent/5, handle_pdu/4, handle_trap/3, handle_inform/3, handle_report/3]).
-export([home/3, snmp/3]).

home(SessionId, Env, _Input) ->
    mod_esi:deliver(SessionId, ["Content-Type:text/html\r\n\r\n" | home(Env)]).

home([{http_host, Host} | _Env]) ->
    "<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"http://"++Host++"/hal.css\" />"++
    "<script type=\"text/javascript\" src=\"http://"++ Host++"/jquery.js\"></script>"++
    "<script type=\"text/javascript\" src=\"http://"++ Host++"/hal.js\"></script>"++
    "<script type=\"text/javascript\" src=\"http://"++ Host++"/hist.js\"></script>"++
    "<script>function comet(el){$.ajax({ type: 'Get', url: 'http://"++Host++"/monitor/hal:snmp?id=' + $(el).attr('id') + '&cursor=' + $(el).attr('class'),"++ 
    "async: true, cache: false, dataType: \"json\","++
    "success : function(data){handleAgentData(el, data);}, error: function(XMLHttpRequest, textStatus, error){ handleError(el, textStatus);}});}" ++
    "$(function(){$.map($(\"canvas\"), function(el, i){comet(el)});});</script></head><body>"++
    "<div id=\"content\"><ul>"++
    "<li><canvas id=\"app\" width=\"200\" height=\"200\" class=\"node\"></canvas></li>"++
    "<li><canvas id=\"game\" width=\"200\" height=\"200\" class=\"node\"></canvas></li>"++
    "<li><canvas id=\"web\" width=\"200\" height=\"200\" class=\"node\"></canvas></li>"++
    "<li><canvas id=\"rabbit\" width=\"200\" height=\"200\" class=\"node\"></canvas></li>"++
    "</ul></div></body></html>";
home([{_, _} | Env]) ->
    home(Env).

snmp(SessionId, Env, _Input) ->
    mod_esi:deliver(SessionId, ["Content-Type:application/json\r\n\r\n" |
    mochijson2:encode({struct, [rotate_info(query_token(4, Env), Agent) || Agent<-snmpm:which_agents(), Agent=:=query_token(2, Env)]}) ]).

rotate_info(Cursor, Agent)->
    case Cursor of
	"mem" ->
	    {disks, disk_info(Agent)};
	"disks" -> 
	    {dht, dht_info(Agent)};
	"dht" -> 
	    {mem, [mem_info(Agent)]};
	_ -> 
	    {disks, disk_info(Agent)}
    end.

disk_info(Agent)->
    [{struct, [{mount, iolist_to_binary(Mount)}, {size, Size}, {use, Use}]}
    || [Mount, Size, Use] <- get_next_row(Agent, ?diskEntry, ?diskTableRow, [?diskEntry++[Col] || Col<-?diskTableRow], [], [?diskId])].

dht_info(Agent)->
    DHTArray = get_next_row(Agent, ?dhtArrayEntry, [?value],  [?dhtArrayEntry++[?value]], [], []),
    lists:flatten(lists:sublist(DHTArray,1,6)).

mem_info(Agent) ->
    {struct, lists:zip([total, used], get_row(Agent, [?memEntry++[Col]++[?memRowId] || Col<-?memTableRow]) )}.

get_row(Agent, Oids)->
    case snmpm:sync_get("kakauser", Agent, Oids) of 
        {ok, {_,_,Vb},_}->
	    [Val || {varbind, _Oid, _, Val, _} <-Vb];
        {error, _Reason} -> []
    end.

get_next_row(_, _, _, [], Acc, _TmpRowIndex) ->
    [Row || Row <- Acc, Row/=[]];
get_next_row(Agent, TableId, Cols, Oids, Acc, TmpRowIndex)->
    case snmpm:sync_get_next("kakauser", Agent, Oids) of
	{ok, {_, _, Vb}, _R} ->
	    Values =[{Oid, Val} || {varbind, Oid, _, Val, _} <- Vb,  Col <- Cols, lists:prefix(TableId++[Col]++TmpRowIndex, Oid)];
	{error, _Reason} ->
	    Values=[]
    end,
    get_next_row(Agent, TableId, Cols, [Oid || {Oid, _} <- Values], [[Value || {_, Value} <- Values]|Acc], TmpRowIndex).

handle_error(_ReqId, _Reason, _UserData) -> ignore. % Ignore errors
handle_agent(_Addr, _Port, _Type, _SnmpInfo, _UserData) -> ignore. % Ignore an unknown  agents
handle_pdu(_TargetName, _ReqId, _SnmpPduInfo, _UserData) -> ignore. % Ignore async request
handle_trap(_TargetName, _SnmpTrapInfo, _UserData) -> ignore. % Ignore notification
handle_inform(_TargetName, _SnmpInformInfo, _UserData) -> ignore. % Ignore info messges
handle_report(_TargetName, _SnmpReportInfo, _UserData) -> ignore. % Ignore reports

% Utils TODO: consider refactoring
query_token(_,[])->ok;
query_token(N,[{query_string, Str}|_])->
    lists:nth(N, string:tokens(Str, "=&_"));
query_token(N,[{_,_}|Env])->
    query_token(N, Env).