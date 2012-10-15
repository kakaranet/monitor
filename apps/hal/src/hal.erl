-module(hal).
-behaviour(snmpm_user).
-include_lib("inets/include/httpd.hrl").
-include_lib("snmp/include/STANDARD-MIB.hrl").

-export([handle_error/3, handle_agent/5, handle_pdu/4, handle_trap/3, handle_inform/3, handle_report/3]).
-export([home/3, snmp/3]).

snmp(SessionId, Env, _Input) ->
    {H, M, S} = time(),
    Resp = [snmpm:sync_get("kakauser", Agent, [?sysName_instance,?sysDescr_instance,?sysContact_instance]) || Agent <- snmpm:which_agents(), Agent=:=agent_id(Env)],
    mod_esi:deliver(SessionId, ["Content-Type:text/html\r\n\r\n" | io_lib:format("~p: ~p:~p:~p", [Resp, H, M, S])]).

home(SessionId, Env, _Input) ->
    mod_esi:deliver(SessionId, ["Content-Type:text/html\r\n\r\n" | home(Env)]).

home([{http_host, Host} | _Env]) ->
    "<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"http://"++Host++"/hal.css\" />"++
    "<script type=\"text/javascript\" src=\"http://"++ Host++"/jquery.js\"></script>"++
    "<script>function comet(el){$.ajax({ type: 'Get', url: 'http://"++Host++"/monitor/hal:snmp?id=' + $(el).attr('id'), async: true, cache: false,"++
    "success : function(data){ $(el).html(data); setTimeout(function(){comet(el);el=null}, 1000)}," ++
    "error: function(XMLHttpRequest, textStatus, error){ $(el).html(textStatus), setTimeout(function(){comet(el);el=null}, 5000);}});}" ++
    "$(function(){$.map($('.node'), function(el, i){comet(el)});});</script></head><body>"++
    "<div id=\"app\" class=\"node\">Hello app</div>"++
    "<div id=\"game\" class=\"node\">Hello game</div>"++
    "<div id=\"web\" class=\"node\">Hello web</div>"++
    "</body></html>";
home([{_, _} | Env]) ->
    home(Env).

agent_id([])-> ok;
agent_id([{query_string, Str} | _])->
    lists:nth(1, string:tokens(Str, "id= &_="));
agent_id([{_,_}|Env])->
    agent_id(Env).

handle_error(_ReqId, _Reason, _UserData) -> ignore. % Ignore errors
handle_agent(_Addr, _Port, _Type, _SnmpInfo, _UserData) -> ignore. % Ignore an unknown  agents
handle_pdu(_TargetName, _ReqId, _SnmpPduInfo, _UserData) -> ignore. % Ignore async request
handle_trap(_TargetName, _SnmpTrapInfo, _UserData) -> ignore. % Ignore notification
handle_inform(_TargetName, _SnmpInformInfo, _UserData) -> ignore. % Ignore info messges
handle_report(_TargetName, _SnmpReportInfo, _UserData) -> ignore. % Ignore reports
