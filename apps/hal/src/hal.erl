-module(hal).
-behaviour(snmpm_user).
-include_lib("inets/include/httpd.hrl").

-export([handle_error/3, handle_agent/5, handle_pdu/4, handle_trap/3, handle_inform/3, handle_report/3]).
-export([home/3, snmp/3]).

snmp(SessionId, _Env, _Input) ->
    {H, M, S} = time(),
    mod_esi:deliver(SessionId, ["Content-Type:text/html\r\n\r\n" | io_lib:format("~p:~p:~p", [H, M, S])]).

home(SessionId, Env, _Input) ->
    mod_esi:deliver(SessionId, ["Content-Type:text/html\r\n\r\n" | home(Env)]).

home([{http_host, Host} | _Env]) ->
    "<html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"http://"++Host++"/hal.css\" />"++
    "<script type=\"text/javascript\" src=\"http://"++ Host++"/jquery.js\"></script>"++
    "<script>function comet(){$.ajax({ type: 'Get', url: 'http://"++Host++"/monitor/hal:snmp', async: true, cache: false,"++
    "success : function(data){ $('#demo').html(data); setTimeout('comet()', 1000)}," ++
    "error: function(XMLHttpRequest, textstatus, error){ $('#demo').html(texststatus), setTimeout('comet()', 5000);}});}" ++
    "$(function(){comet();});</script></head><body><div id=\"demo\" class=\"demo\">Hello</p></body></html>";
home([{_Key, _Value} | Env]) ->
    home(Env).

handle_error(_ReqId, _Reason, _UserData) -> ignore. % Ignore errors
handle_agent(_Addr, _Port, _Type, _SnmpInfo, _UserData) -> ignore. % Ignore an unknown  agents
handle_pdu(_TargetName, _ReqId, _SnmpPduInfo, _UserData) -> ignore. % Ignore async request
handle_trap(_TargetName, _SnmpTrapInfo, _UserData) -> ignore. % Ignore notification
handle_inform(_TargetName, _SnmpInformInfo, _UserData) -> ignore. % Ignore info messges
handle_report(_TargetName, _SnmpReportInfo, _UserData) -> ignore. % Ignore reports
