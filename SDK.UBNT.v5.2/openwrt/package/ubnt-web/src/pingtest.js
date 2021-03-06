var ping_in_progress = false;
var timer_id = [0, 0];
var conn = [null, null];
var is_busy = [false, false];
var MAX_CONNECTIONS = conn.length;
var ping_url = "";
var ping_count = 0;
var ping_form = null;

var min;
var max;
var avg;
var sent_packets;
var received_packets;

function setElementHtml(id, html) {
	var e = document.getElementById(id);
	if (e) {
		e.innerHTML = html;
		return true;
	}
	return false;
}

function addRow(table_id, columns) {
	var i;
	var tbody = document.getElementById(table_id).getElementsByTagName("TBODY")[0];
	var row = document.createElement("TR");
	row.className="pingrow";
	var td;
	var widths = new Array("180px", "140px", "");

	for (i = 0; i < columns.length; ++i) {
		td = document.createElement("TD");
		if (widths[i].length > 0)
		{
			td.style.width = widths[i];
		}
		td.innerHTML = columns[i];
		row.appendChild(td);    	
	}
	tbody.appendChild(row);
	// Firefox hack - resizing container will resize contents properly.
	row.style.width = "90%";
	row.style.width = "100%";

	var scrollDiv = document.getElementById("scroll_results");
	if (scrollDiv)
	{
		scrollDiv.scrollTop = scrollDiv.scrollHeight;
	}
}

function clearTable(table_id) {
	var i;
	var tbody = document.getElementById(table_id).getElementsByTagName("TBODY")[0];
	var rows = tbody.getElementsByTagName("TR");
	for (i = 0; i < rows.length;)
	{
		var index = rows[i].sectionRowIndex;
		tbody.deleteRow(index);
	}
}

function updateStatus() {
	var loss = "0";
	if (received_packets < sent_packets) {
		loss = Math.round((sent_packets - received_packets) * 100/sent_packets);
	}
	setElementHtml("status_rcv", received_packets);
	setElementHtml("status_sent", sent_packets);
	setElementHtml("status_loss", loss);

	if (!received_packets) {
		return;
	}

	var avg_val = Math.round(avg*100)/100;
	setElementHtml("status_min", min);
	setElementHtml("status_avg", avg_val);
	setElementHtml("status_max", max);
}

function clearStatus() {
	setElementHtml('status_rcv', '0');
	setElementHtml('status_sent', '0');
	setElementHtml('status_loss', '0');
	setElementHtml('status_min', '0');
	setElementHtml('status_avg', '0');
	setElementHtml('status_max', '0');
}

function addTimeout() {
	addRow("pingdata", new Array("&nbsp;", pingtest_l10n_timeout, "&nbsp;")); 
	updateStatus(); 
}

function addResult(ip_addr, response_time_ms, ttl) {
	++received_packets;
	if(response_time_ms > max) {
		max = response_time_ms;
	}
	if(response_time_ms < min) {
		min = response_time_ms;
	}
	avg += (response_time_ms - avg)/received_packets;
	addRow("pingdata", new Array(ip_addr, ""+response_time_ms+" ms", ttl));
	updateStatus(); 
}

function handleResponse(httpRequest) {
	var rc = -255;
	try
	{
		if (httpRequest && httpRequest.status != 200) {
			return -2;
		}
		if (httpRequest && httpRequest.status == 200)
		{
			results = httpRequest.responseText.split('|');
			if (results.length > 0)
			{
				rc = parseInt(results[0]);
			}
		}
	} catch(e) {
		//just eat exception if any
		return -1;
	}
	if (rc && rc != -4) {
		//error
		return -1;
	}
	++sent_packets;
	if (rc == -4) {
		//timeout
		addTimeout();
		return 0;
	}
	var i;
	for (i=1; i<results.length; i+=3) {
		addResult(results[i],parseFloat(results[i+1]), parseInt(results[i+2]));
	}
	return 0;
}

function pingAction(idx)
{
	is_busy[idx] = true;
	if(!conn[idx].get(getPingUrl(),
		function (httpRequest) {
			is_busy[idx] = false;
			var rc = handleResponse(httpRequest);
			if (rc == -2) {
				stopPing();
				window.location.reload();
			} else if (rc == -1 || ping_count < 1) {
				stopPing();
			}
		} ))
	{
		is_busy[idx] = false;
		--sent_packets;
		// Display error somewhere? 
		return false;
	}	
	return true;
}

function getPingUrl() {
	return ping_url + "&q="+Math.random();
}

function initPing() {
	var i;
	for (i = 0; i < MAX_CONNECTIONS; ++i)
	{
		if (conn[i]) {
			// abort just in case
			abortConnection(i)
		} else {
			conn[i] = new ajax();
		}
	}
	var dst_addr_select = ping_form.dst_addr_select.options[ping_form.dst_addr_select.selectedIndex].value;
	var dst_addr_input = ping_form.dst_addr_input.value;
	if (conn == null || dst_addr_select == "0" && dst_addr_input.length == 0) {
		return false;
	}        
	var ping_size = ping_form.ping_size.value;	
	ping_count = ping_form.ping_count.value;

	var query_string = "action=pingtest";
	query_string = query_string + "&dst_addr_select="+dst_addr_select;
	query_string = query_string + "&dst_addr_input="+dst_addr_input;
	query_string = query_string + "&ping_size="+ping_size;
	ping_url = "pingtest_action.cgi?"+query_string;

	min = 9999999.9;
	max = 0.0;
	avg = 0.0;
	sent_packets = 0;
	received_packets = 0;
	return true;	
}

function doPing(idx) {
	if (ping_in_progress) {
		if (abortConnection(idx)) {
			++sent_packets;
			addTimeout();
		}
		if (ping_count < 1 && ping_count > 1 - MAX_CONNECTIONS)
		{		
			/* Do nothing because we are waiting for all connections to complete */
			ping_count--;
		}
		else if (ping_count > 0 && pingAction(idx))
		{
			if (ping_count-- > 0)
			{
				timer_id[idx] = setTimeout("doPing("+idx+")", 1000*MAX_CONNECTIONS);
			}
		}
		else
		{
			stopPing();			
		}		
	}
}

function startPing(form) {
	var i;
	ping_form = form;
	if (ping_in_progress) {
		return false;
	}
	if (!initPing()) {
		return false;
	}
	ping_in_progress = true;
	pingStarted();
	for (i = 0; i < MAX_CONNECTIONS; ++i)
	{
		timer_id[i] = setTimeout("doPing("+i+")", 1000*i);
	}
	return true;
}

function runPing(form) {
	if (ping_in_progress) {
		stopPing();
	} else {
		startPing(form);
	}
}

function abortConnection(idx) {
	if (conn[idx] && is_busy[idx])
	{
		conn[idx].abort();
		is_busy[idx] = false;		
		return true;
	}
	return false;
}

function abortConnections()
{
	var i;
	for (i = 0; i < MAX_CONNECTIONS; ++i)
	{
		abortConnection(i);
	}
}

function stopPing() {
	ping_in_progress = false;
	abortConnections();
	for (i = 0; i < MAX_CONNECTIONS; ++i)
	{
		if (timer_id[i] !== 0) {
			clearTimeout(timer_id[i]);
			timer_id[i] = 0;
		}
	}
	pingStopped();
}

function pingStarted() {
	var ping = document.getElementById("ping");
	if (ping) { ping.value=l10n_stop; }

	setDisabled(ping_form.dst_addr_select, true);
	setDisabled(ping_form.dst_addr_input, true);
	setDisabled(ping_form.ping_count, true);
	setDisabled(ping_form.ping_size, true);
	clearTable("pingdata");
	clearStatus();	
}

function pingStopped() {
	var ping = document.getElementById("ping");
	if (ping) { ping.value=l10n_start; }

	setDisabled(ping_form.dst_addr_select, false);
	if (iplist) { iplist.triggerManual(ping_form.dst_addr_select); }
	setDisabled(ping_form.ping_count, false);
	setDisabled(ping_form.ping_size, false);
}
