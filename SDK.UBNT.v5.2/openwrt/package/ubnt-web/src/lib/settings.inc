<?
$wlan_iface = "ath0";
$br_iface = "br0";
$eth_iface = "eth0";
$wan_iface = "eth1";
$lan_iface = "eth0";
$cfg_file = "/tmp/system.cfg";
$cfg_file_bak = "/tmp/running.cfg";
$fwup_lock = "/tmp/fwup-started";
$test_lock_file = "/var/run/testmode";
$test_mode_time = 180;
$proc_modules="/proc/modules";
$cmd_cfgsave = "/sbin/cfgmtd -p /etc/ -w";
$cmd_cfgrestore = "/sbin/cfgmtd -p /etc/ -r -f " + $cfg_file;
$def_cfg_file = "/etc/default.cfg";
$cmd_cfgdef = "/sbin/cfgmtd -w -f " + $def_cfg_file;
$cmd_reboot = "/sbin/reboot";
$cmd_ebtables = "/sbin/ebtables ";
$cmd_iptables = "/sbin/iptables ";
$cmd_regdomain = "regdomain ";
$cmd_scanparser = "/bin/scanparser ";
$cmd_brctl = "brctl ";
$cmd_log = "/bin/cat /var/log/messages";
$cmd_webping = "/bin/webping";
$cmd_pppstats = "/bin/pppstats -a -r ";
$cmd_wstalist = "/bin/wstalist";
$cmd_iwpriv = "/sbin/iwpriv";
$dss_priv_filename = "/etc/persistent/dropbear_dss_host_key";
$rsa_priv_filename = "/etc/persistent/dropbear_rsa_host_key";
$dss_rsa_gen_time = 70;

$soft_reboot_time=20;
$defip = "192.168.1.20";

$def_rate_module = "ath_rate_atheros";

$db_sessions = "/tmp/.sessions.tdb";
$db_tickets = "/tmp/.tickets.tdb";

$feature_legacy = 0;
$feature_locked_coutrycode = 0;
$feature_obey_rd = 1;
$feature_antennas = 0;
$feature_builtin_antenna = 0;
$feature_diversity = 0;
$feature_super = 1;
$feature_super_comp = 0;
$feature_clksel = 1;
$feature_macclone = 0;
$feature_ratemodule = 0;
$feature_chanshift = 1;
$feature_chanlist = 1;
$feature_ap_scan = 1;
$feature_noiseim = 0;
$feature_qos = 0;
$feature_mcastrate = 0;
$feature_datarate = 1;
$feature_sta_channel = 0;
$feature_logo = 0;
$feature_ccq = 1;
$feature_ap = 1;
$feature_polling = 1;
$feature_airview = 1;
$radio_cap_11n_no_ht40 = 1024;
$radio_cap_airmax_only = 2048;

$mac_acl_max = 32;
$ipaliases_max = 8;

$radio1_name = "unknown";
$radio1_shortname = "unknown";
$oem_copyright = "txt_copyright|&copy; Copyright 2006-2010 Ubiquiti Networks, Inc.";
$logo_url = "http://www.ubnt.com";
$logo_gif = "ulogo.gif";

include("/etc/board.inc");
include("lib/oem.inc");
>
