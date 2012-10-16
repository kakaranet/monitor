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