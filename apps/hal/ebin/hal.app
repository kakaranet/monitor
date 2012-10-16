{application,hal,
             [{description,"HAL Monitor"},
              {vsn,"1"},
              {registered,[hal_sup]},
              {applications,[kernel,stdlib,sasl,inets,crypto,snmp]},
              {mod,{hal_app,[]}},
              {env,[]},
              {modules,[hal,hal_app,hal_sup,mochijson2,mochinum]}]}.
