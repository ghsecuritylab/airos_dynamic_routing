#!/sbin/cgi
<?
include("lib/settings.inc");
$cfg = @cfg_load($cfg_file);
include("lib/l10n.inc");
$pagetitle = dict_translate("Applying...");
$message = dict_translate("msg_conf_applied|Configuration is being applied, please stand by...");
$duration = $soft_reboot_time;
include("lib/link.inc");
include("lib/ipcheck.inc");
$added_time = 0;
if ($cfg != -1) {
       	$sshd_state = cfg_get_def($cfg, "sshd.status", "disabled");
       	if ($sshd_state == "enabled") {
       		if ((fileinode($dss_priv_filename) == -1) ||
       			(fileinode($rsa_priv_filename) == -1)) {
       				$added_time = $dss_rsa_gen_time;
       				$duration = $duration + $added_time;
       		}
       	}
}
$country = cfg_get_country($cfg, $wlan_iface, $country);
if ($country != 511) {
	$sr_delay = 1;
}
else {
	$sr_delay = 2;
}

if (strlen($testmode) != 0) {
	$fp = @fopen($test_lock_file, "w");
	if ($fp != -1) {
		@fputs($fp, $test_mode_time);
		@fclose($fp);
		chmod($test_lock_file, 755);
                cfg_save($cfg, $cfg_file_bak);
		bgexec($sr_delay, "/usr/etc/rc.d/rc.softrestart test");
        }
} else {
	chmod($cfg_file, "644");
        @unlink($test_lock_file);
	bgexec($sr_delay, "/usr/etc/rc.d/rc.softrestart save");
}
exit;
>
