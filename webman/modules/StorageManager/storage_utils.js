/* Copyright (c) 2016 Synology Inc. All rights reserved. */

Ext.namespace("SYNO.SDS.StorageUtils");SYNO.SDS.StorageUtils=function(){var a=SYNO.SDS.Utils.StorageUtils.UiRenderHelper;return{ISCSITRG_UNIT_GB:SYNO.SDS.Utils.StorageUtils.ISCSITRG_UNIT_GB,SpaceIDParser:SYNO.SDS.Utils.StorageUtils.SpaceIDParser,GetSizeGB:SYNO.SDS.Utils.StorageUtils.GetSizeGB,SizeRenderWithFloor:a.SizeRenderWithFloor,GetSizeUnitWithFloor:a.GetSizeUnitWithFloor,SizeRender:a.SizeRender,GetSizeUnit:a.GetSizeUnit,StatusRender:a.StatusRender,LunStatusRender:a.LunStatusRender,StatusNameRender:a.StatusNameRender,ProgressRender:a.ProgressRender,WarningTextRender:a.WarningTextRender,StepNameRender:a.StepNameRender,PercentRender:a.PercentRender,RaidLevelRender:a.RaidLevelRender,SpaceTypeRender:a.SpaceTypeRender,DeviceTypeRender:a.DeviceTypeRender,ParseID:a.ParseID,DiskIDRender:a.DiskIDRender,DiskStatusRender:a.DiskStatusRender,DiskSwapStatusRender:a.DiskSwapStatusRender,smartStatusRender:a.smartStatusRender,AddDiskTypeRender:a.AddDiskTypeRender,MigrateTypeRender:a.MigrateTypeRender,TargetStatusRender:a.TargetStatusRender,SpareStatusRender:a.SpareStatusRender,SnapShotStatusRender:a.SnapShotStatusRender,getErrorMsg:a.getErrorMsg,decodeResponse:a.decodeResponse,htmlEncoder:a.htmlEncoder,htmlDecoder:a.htmlDecoder,getServiceNames:a.getServiceNames,getVolumeNames:a.getVolumeNames,getNamesString:a.getNamesString,disableServices:a.disableServices,DiskTemperatureRender:a.DiskTemperatureRender,DiskSummaryStatusRender:a.DiskSummaryStatusRender}}();SYNO.SDS.StorageUtils.TipTemplate=Ext.extend(Ext.XTemplate,{constructor:function(a){SYNO.SDS.StorageUtils.TipTemplate.superclass.constructor.call(this,"{[this.getText(values."+a+")]}")},getText:function(c){var a="";var b="";if(Ext.isObject(c)){if(Ext.isString(c.tip)){a=Ext.util.Format.htmlEncode(c.tip)}else{a=Ext.util.Format.htmlEncode(c.text)}if(Ext.isDefined(SYNO.SDS.StorageUtils.TipTemplate.TEXT_LENGTH)){b=Ext.util.Format.ellipsis(c.text,SYNO.SDS.StorageUtils.TipTemplate.TEXT_LENGTH)}else{b=c.text}return String.format('<span ext:qtip="{0}">{1}</span>',a,b)}else{return c}}});SYNO.SDS.StorageUtils.TipTemplate.TEXT_LENGTH=undefined;SYNO.SDS.StorageUtils.TipRenderer=function(b,a){a.attr='ext:qtip="'+Ext.util.Format.htmlEncode(Ext.util.Format.htmlEncode(b))+'"';return Ext.util.Format.htmlEncode(b)};SYNO.SDS.StorageUtils.check=function(){var a,b;for(a=0;a<arguments.length;a++){b=arguments[a];if(Ext.isFunction(b)&&!b.call(this)){return false}else{if(Ext.isString(b)&&!this[b]()){return false}}}return true};SYNO.SDS.StorageUtils.isAnyMatched=function(){var a=arguments;return -1!==this.findBy(function(b){return b.check.apply(b,a)})};SYNO.SDS.StorageUtils.getMatched=function(){var b=arguments;var a,d,c=[];for(a=0;a<this.getCount();a++){d=this.getAt(a);if(d.check.apply(d,b)){c.push(d)}}return c};SYNO.SDS.StorageUtils.FormatSuggestion=function(a){var c=_T("volume",a.str);var b=a.arg;if(typeof b=="undefined"||b===null){return c}else{return c.replace(/\{(\d+)\}/g,function(d,e){return b[e]})}};SYNO.SDS.StorageUtils.IsAnyMappedTargetConnected=function(d,a){var c=false;var b;Ext.each(a,function(e){if("connected"!==e.get("status")){return true}for(b=0;b<e.get("mapped_luns").length;b++){if(d.lid===e.get("mapped_luns")[b]){c=true;return false}}});return c};SYNO.SDS.StorageUtils.HARemoteCheckErrParsing=function(b){var a=[];var c=b.errors;if(!_S("ha_running")){return}if(undefined!==c.ha_remote_size_err_disks&&0<c.ha_remote_size_err_disks.size()){a.push(String.format(_TT("SYNO.SDS.HA.Instance","wizard","error_disk_size"),c.ha_remote_size_err_disks.map(SYNO.SDS.HA.HADiskIndexRenderer).join(", ")))}if(undefined!==c.ha_remote_type_err_disks&&0<c.ha_remote_type_err_disks.size()){a.push(String.format(_TT("SYNO.SDS.HA.Instance","wizard","error_disk_type"),c.ha_remote_type_err_disks.map(SYNO.SDS.HA.HADiskIndexRenderer).join(", ")))}if(undefined!==c.ha_remote_log_sect_size_err_disks&&0<c.ha_remote_log_sect_size_err_disks.size()){a.push(String.format(_TT("SYNO.SDS.HA.Instance","wizard","error_disk_log_sect_size"),c.ha_remote_log_sect_size_err_disks.map(SYNO.SDS.HA.HADiskIndexRenderer).join(", ")))}if(true===c.ha_remote_offline){a.push(_TT("SYNO.SDS.HA.Instance","ui","error_passive_not_online"))}if(true===c.ha_remote_space_failed){a.push(_TT("SYNO.SDS.HA.Instance","wizard","error_passive_space_unmatched"))}if(true===c.ha_remote_memory_size_mismatch){a.push(_TT("SYNO.SDS.HA.Instance","ui","error_fcache_memsize"))}b.text=a.join("<br><br>");if(""===b.text){b.text=_T("error","error_error_system")}};SYNO.SDS.StorageUtils.isExistRunningvDSM=function(d,a){var c=false;var b;Ext.each(d,function(e){for(b=0;b<a.length;b++){if(e.get("id")===a[b]&&e.get("exist_alive_vdsm")){c=true;return false}}});return c};Ext.namespace("SYNO.SDS.StorageManager.ISCSI");SYNO.SDS.StorageManager.ISCSI.DefaultIQN="iqn.2000-01.com.synology:default.acl";SYNO.SDS.StorageManager.ISCSI.FAKE_PWD="1234567890AB";SYNO.SDS.StorageManager.ISCSI.FAKE_PWDC="BA0987654321";SYNO.SDS.StorageManager.ISCSI.Util=function(){return{SetActionLunParentStatus:function(b){var a=function(d,e){var c;Ext.each(d,function(f){if(e===f.iscsi_lun.lid){c=f;return false}});return c};Ext.each(b,function(d){var c;if("cloning"===d.status){c=a(b,d.iscsi_lun.parent.plid);if(Ext.isDefined(c)&&!c.is_actioning){c.status="using";c.is_actioning=true}}})},LunParentRender:function(d,a){var f,c,e,b;if(!Ext.isObject(a.parent)||a.lid===a.parent.plid){return false}f=d.getMatched(function(){if(this.get("iscsi_lun").lid===a.parent.plid){return true}});if(0===f.length){return false}c=f[0].get("iscsi_lun");e=c.name;if(0===a.parent.psid){return e}Ext.each(c.snapshots,function(g){if(a.parent.psid===g.sid){b=g.name;return false}});if(b){return e+" / "+b}else{return e}},SupportSnapshot:function(){if("yes"===_D("support_vaai","no")&&("lio"===_D("iscsi_target_type","lio")||"lio4x"===_D("iscsi_target_type",""))){return true}return false},genNewSnapShotName:function(c){var b="SnapShot-",a=b.length,d=0;Ext.each(c,function(e){var f=parseInt(e.name.slice(a),10);if(d<f){d=f}});d=d+1;return b+d},isUpToiSCSISnapShotActionCount:function(c){var a=SYNO.SDS.StorageManager.Limits.MAX_SNAPSHOT_ACTIONING_COUNT,b,d=0;Ext.each(c,function(e){b=e.get("status");if(!e.get("iscsi_lun").extent_based){return true}if("cloning"===b||"restoring"===b){d=d+1}else{Ext.each(e.get("iscsi_lun").snapshots,function(f){if("creating"===f.status.type){d=d+1}})}});return d>=a},renderPermission:function(b){var a={rw:_T("share","share_permission_writable"),r:_T("share","share_permission_readonly"),"-":_T("share","share_permission_none")};if(b in a){return a[b]}else{return b}},renderIQN:function(c,b){var a=(SYNO.SDS.StorageManager.ISCSI.DefaultIQN===c)?_T("iscsitrg","iscsitrg_masking_default"):c;if(b){b.attr='ext:qtip="'+Ext.util.Format.htmlEncode(a)+'"'}return a}}}();SYNO.SDS.StorageUtils.CheckFailedMsg=function(b){var d,a,c="pass";if(!b){return c}for(d in b){if(b.hasOwnProperty(d)){if("hard_failed"===c){break}for(a in b[d]){if(b[d].hasOwnProperty(a)){if(b[d][a].hard){c="hard_failed";break}else{if(b[d][a].soft){c="soft_failed"}}}}}}return c};SYNO.SDS.StorageUtils.UpdateGridCheckMsg=function(b,d,a){var c,e;for(c=0;c<d.length;++c){e=SYNO.SDS.Utils.GetFeasibilityCheckMsg(d[c]);if(0===c){a.appendSub(b,e)}else{a.appendSub("",e)}}};SYNO.SDS.StorageUtils.CheckMsg=function(b,g,e,c){var f,a=SYNO.SDS.StorageUtils,d;if(!b||!b[e]){return}for(f in b[e]){if(b[e].hasOwnProperty(f)){if("volumes"===e){d=SYNO.SDS.Utils.StorageUtils.VolumeNameRenderer(f)}else{d=f}if(g){if(b[e][f].hard){a.UpdateGridCheckMsg(d,b[e][f].hard,c)}}else{if(b[e][f].soft){a.UpdateGridCheckMsg(d,b[e][f].soft,c)}}}}};SYNO.SDS.StorageUtils.ReportWebapiFailure=function(a,c){var b;if(undefined===c||undefined===a){return}if("string"===typeof c.text){b=c.text}else{b=c.errors?this.getErrorMsg(c.errors):_T("error","error_subject")}if(a.getMsgBox){a.getMsgBox().alert(a.title,b)}else{if(a.owner.getMsgBox){a.owner.getMsgBox().alert(a.title,b)}else{throw Error("Not found 'getMsgBox'")}}};SYNO.SDS.StorageUtils.DiskSort=function(f,e){var d=f.numId;var h=e.numId;var c=f.ctnOder;var g=e.ctnOder;if(c>g){return 1}if(c<g){return -1}if(d>h){return 1}if(d<h){return -1}return 0};