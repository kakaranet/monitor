-define(diskEntry, [1,3,6,1,4,1,193,19,3,2,2,2,2,1]).
-define(diskId, 1).
-define(diskDescr, 2).
-define(diskKBytes, 3).
-define(diskCapacity, 4).
-define(diskTableRow, [?diskDescr, ?diskKBytes, ?diskCapacity]).

-define(dhtArrayEntry, [1,3,6,1,4,1,40750,1,1,1,1,1]).
-define(arrayIndex, 1).
-define(value, 2).

-define(dht2Entry, [1,3,6,1,4,1,40750,1,1,1,2,1]).
-define(dhtIndex, 1).
-define(handoffTimeouts, 2).
-define(nodeGetsTotal, 3).
-define(nodePutsTotal, 4).
-define(cpuAvg15, 5).
-define(nodeGetFsmTimeMedian, 6).
-define(nodePutFsmTimeMedian, 7).
-define(dht2Row, [?handoffTimeouts, ?nodeGetsTotal, ?nodePutsTotal,?cpuAvg15, ?nodeGetFsmTimeMedian, ?nodePutFsmTimeMedian]).
-define(dht2RowMetrics, [handoff_timeouts, node_gets_total, node_puts_total, cpu_avg15, node_get_fsm_time_median, node_put_fsm_time_median]).

-define(memEntry, [1,3,6,1,4,1,40750,1,1,2,1,1]).
-define(memRowId, 1).
-define(total, 2).
-define(used, 3).
-define(memTableRow, [?total, ?used]).