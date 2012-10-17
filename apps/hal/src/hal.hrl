%$ df -h
%Filesystem      Size  Used Avail Use % Mounted on
%/dev/loop0       29G  9.3G   19G  33% /
%udev            2.9G  4.0K  2.9G   1% /dev
%tmpfs           1.2G  904K  1.2G   1% /run
%none            5.0M     0  5.0M   0% /run/lock
%none            2.9G  892K  2.9G   1% /run/shm
%/dev/sda3       920G  220G  700G  24% /host

%% Disk snmp table
% ind1(0) | ind2 (1) | diskMount (2)| diskKBytes(3) | diskUse % (4)
% =================================================================
% entry № |     6    |     /host    |  963 876 860  |   24

-define(diskTableEntry, [1,3,6,1,4,1,193,19,3,2,2,2,2,1]).
-define(diskEntryNo, 1).
-define(diskMount, 	[1,3,6,1,4,1,193,19,3,2,2,2,2,1,2]).
-define(diskSize, 	[1,3,6,1,4,1,193,19,3,2,2,2,2,1,3]).
-define(diskUse, 	[1,3,6,1,4,1,193,19,3,2,2,2,2,1,4]).
-define(diskTableRow, [?diskMount, ?diskSize, ?diskUse]).


%% Os load snmp table
-define(loadTable, 				[1,3,6,1,4,1,193,19,3,2,2,1,3]).
-define(loadEntry, 				[1,3,6,1,4,1,193,19,3,2,2,1,3,1]).
-define(loadErlNodeName, 			1).
-define(loadSystemTotalMemory, 			2).
-define(loadSystemUsedMemory, 			3).
-define(loadLargestErlProcess, 			4).
-define(loadLargestErlProcessUsedMemory,	5).
-define(loadCpuLoad, 				6).
-define(loadCpuLoad5, 				7).
-define(loadCpuLoad15, 				8).
-define(loadOsWordsize, 			9).
-define(loadSystemTotalMemory64, 		10).
-define(loadSystemUsedMemory64, 		11).
-define(loadLargestErlProcessUsedMemory64, 	12).

%% erlang node
-define(erlNodeTable, [1,3,6,1,4,1,193,19,3,1,2,1,1]).
-define(erlNodeEntry, [1,3,6,1,4,1,193,19,3,1,2,1,1,1]).
-define(erlNodeId, 1).
-define(erlNodeName, 2).
-define(erlNodeMachine, 3).
-define(erlNodeVersion, 4).
-define(erlNodeRunQueue, 5).
-define(erlNodeRunTime, 6).
-define(erlNodeWallClock, 7).
-define(erlNodeReductions, 8).
-define(erlNodeProcesses, 9).
-define(erlNodeInBytes, 10).
-define(erlNodeOutBytes, 11).

%% applications
-define(appls, [1,3,6,1,4,1,193,19,3,1,2,2]).
-define(applTable, [1,3,6,1,4,1,193,19,3,1,2,2,1]).
-define(applEntry, [1,3,6,1,4,1,193,19,3,1,2,2,1,1]).
-define(applId, 1).
-define(applName, 2).
-define(applDescr, 3).
-define(applVsn, 4).


