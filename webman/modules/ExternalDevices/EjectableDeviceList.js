/* Copyright (c) 2016 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.ExternalDevices");SYNO.SDS.ExternalDevices.Application=Ext.extend(SYNO.SDS.AppInstance,{initInstance:function(a){this.trayItem=this.trayItem||[];if(!this.trayItem[0]){this.trayItem[0]=new SYNO.SDS.ExternalDevices.Tray({appInstance:this});this.addInstance(this.trayItem[0]);this.trayItem[0].open(a)}}});Ext.define("SYNO.SDS.ExternalDevices.Tray",{extend:"SYNO.SDS.Tray.ArrowTray",initPanel:function(){var a=this;return new SYNO.SDS.ExternalDevices.Panel({module:a,baseURL:a.jsConfig.jsBaseURL})}});Ext.define("SYNO.SDS.ExternalDevices.Panel",{extend:"SYNO.SDS.Tray.Panel",storeId:"EjectableDevicesTray",pollTask:null,pollTaskConfig:null,pollingInterval:15,externalDeviceJson:null,device_set:{},constructor:function(b){this.gcList=[];SYNO.SDS.ExternalDevices.Panel.superclass.constructor.call(this,Ext.apply({hidden:true,floating:true,shadow:false,title:_T("tree","node_device"),width:320,height:300,cls:"sds-eject-device-panel",renderTo:document.body,items:this.dataView=new SYNO.ux.FleXcroll.DataView({itemSelector:"div.item",emptyText:"No Ejectable Devices.",itemId:"dataview",cls:"sds-eject-device-view",singleSelect:true,store:new Ext.data.JsonStore({autoDestroy:true,storeId:this.storeId,root:"deviceList",fields:["dev_id","dev_title","dev_type","product","status","partitions"]}),listeners:{click:{fn:this.nodeClick,scope:this,buffer:80}},tpl:new Ext.XTemplate('<tpl for=".">','<div class="item">',"{[this.getEjectContainer(values)]}",'<div class={[this.getIconSelector(values.dev_type)]} style="float: left;"></div><div class="title" ext:qtip="{[this.localizeNoTags(this.getDisplayName(values))]}">{[this.localize(this.getDisplayName(values))]}</div>',"{[this.getEjectContent(values)]}","</div>","</div>","</tpl>","</div>",{compiled:true,disableFormats:true,localize:this.localizeMsg.createDelegate(this,[false],true),localizeNoTags:this.encodedMsg.createDelegate(this,[true],true),getIconSelector:this.iconRenderer.createDelegate(this),getStatus:this.statusRenderer.createDelegate(this),getEjectContainer:this.getEjectContainer.createDelegate(this),getDisplayName:this.getEjectTitle.createDelegate(this),getEjectContent:this.getEjectContent.createDelegate(this)})})},b));Ext.StoreMgr.get(this.storeId).removeAll();var a=[{api:"SYNO.Core.ExternalDevice.Storage.USB",version:1,method:"list",additional:["dev_type","product","status","partitions"]},{api:"SYNO.Core.ExternalDevice.Storage.eSATA",version:1,method:"list",additional:["dev_type","status"]}];if("yes"===_D("usbstation")){a.push({api:"SYNO.Core.SystemDB",version:1,method:"get"})}this.pollTaskConfig={interval:this.pollingInterval,webapi:{api:"SYNO.Entry.Request",version:1,method:"request",params:{compound:a}},scope:this,status_callback:this.loadData};this.pollTask=this.pollReg(this.pollTaskConfig);this.mon(SYNO.SDS.StatusNotifier,"halt",function(){this.pollUnreg(this.pollTask)},this);this.mon(SYNO.SDS.StatusNotifier,"redirect",function(){this.pollUnreg(this.pollTask)},this)},getEjectTitle:function(a){var b=this.displayNameRenderer(a.dev_type);if(a.status&&a.status!=="Normal"){var c=String.format("{0}: {1}",b,this.statusRenderer(a));return c}return this.encodedMsg(b)},getEjectContent:function(a){if(a.product){return String.format('<div class="msg" ext:qtip="{0}"> {0}</div>',this.encodedMsg(a.product))}if(a.dev_type=="eSataDisk"){return String.format('<div class="msg" ext:qtip="{0}"> {0}</div>',this.encodedMsg(a.dev_title))}return'<div class="msg"></div>'},canEject:function(c){var d=c.dev_type,b=c.status,a=true;switch(d){case"usbDisk":case"sdCard":a=(b!=="formatting"&&b!=="init");break;case"eSataDisk":a=(b!=="formatting");break}return a},getEjectContainer:function(a){var b=!this.canEject(a);return b?'<div class = "sds-eject-device-button"></div>':'<span class = "sds-eject-device-button"></span>'},initEjectButton:function(){var a=this.getEl().select("span.sds-eject-device-button"),b={tooltip:_T("usb","usb_eject"),iconCls:"eject",scale:"medium",scope:this};this.gcList.each(function(d){d.destroy();d=null});this.gcList.splice(0,this.gcList.length);var c=function(e){var d=new SYNO.SDS.ExternalDevices.Button(b);d.render(e);this.gcList.push(d);e=null};a.each(c,this);a=null},statusRenderer:function(b){var a="";switch(b.dev_type){case"usbDisk":a=SYNO.SDS.Utils.ExternalDevices.getStatus(b.status);break;case"sdCard":a=SYNO.SDS.Utils.ExternalDevices.getStatus(b.status);break;case"eSataDisk":a=SYNO.SDS.Utils.ExternalDevices.getStatusForESata(b.status,b.sharedfolder);break}return a},displayNameRenderer:function(b){var a="";switch(b){case"usbDisk":a=_T("tree","leaf_usbdisk");break;case"sdCard":a=_T("tree","leaf_sdcard");break;case"eSataDisk":a=_T("tree","leaf_esata");break}return a},iconRenderer:function(b){var a="";switch(b){case"usbDisk":a="sds-external-device-usb";break;case"sdCard":a="sds-external-device-sd";break;case"eSataDisk":a="sds-external-device-usb-esata";break}return a},isEjectable:function(a){var b=a.get("dev_type");switch(b){case"usbDisk":return true;case"sdCard":return true;case"eSataDisk":return true}return false},nodeClick:function(j,f,a,g){var h=g.getTarget("Button",1,true),d=this.dataView.getRecord(a),i=d.get("dev_type"),c=d.get("status");var b=this.canEject({device_type:i,status:c});if(h&&b){this.ejectDevice(d)}d=null;h=null},ejectDevice:function(b){var a=this;if(!b){return}a.hide();var c=this.getEjectMsg(b);a.getMsgBox().confirm(_T("tree","node_device"),c,function(d,e){if(d=="yes"){this.doEjectAction(b)}},this)},getEjectMsg:function(b){var c=_T("usb","usb_ejectwarn");var a;if("yes"===_D("usbstation")){if(b.data&&b.data.partitions){a=b.data.partitions}if(this.systemdb_share&&a){a.each(function(d){if(this.systemdb_share===d.share_name){c=_T("system","eject_sys_database_warning")}},this)}}return c},getMsgBox:function(){var a=this;if(!a.msgBox||a.msgBox.isDestroyed){a.msgBox=new SYNO.SDS.MessageBoxV5({modal:true,draggable:false,renderTo:document.body})}return a.msgBox.getWrapper()},doEjectAction:function(d){var b=_T("tree","node_device"),c=d.get("dev_type");var a={method:"eject",version:1,params:{}};a.params.dev_id=d.get("dev_id");if(c==="usbDisk"||c==="sdCard"){a.api="SYNO.Core.ExternalDevice.Storage.USB"}else{if(c==="eSataDisk"){a.api="SYNO.Core.ExternalDevice.Storage.eSATA"}}this.sendWebAPI({api:a.api,version:a.version,method:a.method,params:a.params,scope:this,callback:function(i,f,h,e){if(!i){var g="";if(f.code){g=SYNO.API.getErrorString(f.code);this.getMsgBox().alert(b,g)}else{this.getMsgBox().alert(b,_T("common","error_system"))}return}}})},localizeMsg:function(e,b){var c=[];if(!Ext.isArray(e)){e=[e]}for(var a=0;a<e.length;a++){c.push(SYNO.SDS.Utils.GetLocalizedString(e[a]))}var d=String.format.apply(String,c);if(b){return Ext.util.Format.stripTags(d)}else{return d}},encodedMsg:function(b,a){return Ext.util.Format.htmlEncode(this.localizeMsg(b,a))},onShow:function(){SYNO.SDS.ExternalDevices.Panel.superclass.onShow.apply(this,arguments);var a=this.externalDeviceJson;this.loadJsonData(a)},loadData:function(h,f,g,c){var b=this,a=f.result,d={data:{deviceList:[]}},e=d.data.deviceList;a.each(function(i){if(i.success&&i.data.devices){e=e.concat(i.data.devices)}});if("yes"===_D("usbstation")){this.systemdb_share=SYNO.API.Util.GetValByAPI(f,"SYNO.Core.SystemDB","get","systemdb_shares")}d.data.deviceList=e;b.externalDeviceJson=d;this.checkDeviceListChanged(e);if(!Ext.isArray(e)||e.length===0){b.hideTray();return}b.loadJsonDataByPolling(d)},hideTray:function(){var a=this;Ext.StoreMgr.get(a.storeId).removeAll();a.module.setTaskButtonVisible(false);a.hide()},haveRecord:function(a){var b,e=a.length,d,c;for(b=0;b<e;b++){c=a[b];d=c.dev_type;if(!d){continue}switch(d){case"usbDisk":return true;case"sdCard":return true;case"eSataDisk":return true}}return false},checkDeviceListChanged:function(b){var d,a,c=false,f=false,e={};for(d=0;d<b.length;d++){if(!this.device_set.hasOwnProperty(b[d].dev_id)){c=true}e[b[d].dev_id]=true}for(a in this.device_set){if(this.device_set.hasOwnProperty(a)){if(!e[a]){f=true;break}}}if(c){SYNO.SDS.StatusNotifier.fireEvent("externaldeviceactivity","injectdevice")}if(f){SYNO.SDS.StatusNotifier.fireEvent("externaldeviceactivity","ejectdevice")}this.device_set=e},loadJsonDataByPolling:function(a){var b=this;if(!b.haveRecord(a.data.deviceList)){b.hideTray()}else{b.module.setTaskButtonVisible(true)}b.loadJsonData(a)},loadJsonData:function(b){var c=this;if(c.isVisible()){var a=Ext.StoreMgr.get(c.storeId);a.loadData(b.data);a.filterBy(c.isEjectable);c.initEjectButton()}},beforeDestroy:function(){var a=this;SYNO.SDS.ExternalDevices.Panel.superclass.beforeDestroy.call(a);if(a.msgBox&&!a.msgBox.isDestroyed){a.msgBox.destroy();delete a.msgBox}delete a.externalDeviceJson}});SYNO.SDS.ExternalDevices.Button=Ext.extend(Ext.Button,{beforeDestroy:function(){var a=this;if(a.rendered){a.clearTip()}if(a.menu&&a.destroyMenu!==false){Ext.destroy(a.menu)}Ext.destroy(a.btnEl,a.repeater)}});