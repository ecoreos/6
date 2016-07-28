/* Copyright (c) 2016 Synology Inc. All rights reserved. */

Ext.ns("SYNO.FileStation");SYNO.FileStation.UploadDialog=function(b){Ext.apply(this,b||{});var a=this.init();var c={owner:this.owner,width:580,height:450,shadow:true,minWidth:580,minHeight:200,collapsible:false,autoScroll:false,constrainHeader:true,plain:true,title:_WFT("filetable","filetable_upload"),layout:"fit",items:a,buttons:[{btnStyle:"blue",text:_WFT("common","common_submit"),scope:this,handler:this.submitForm},{text:_WFT("common","common_cancel"),scope:this,handler:this.closeHandler}],keys:[{key:27,fn:this.closeHandler,scope:this}],listeners:{afterlayout:{fn:function(){this.center()},scope:this,single:true},beforeshow:{fn:function(){this.reset(this.blDisableWriteOption);this.addUpFileForm()},scope:this}}};SYNO.FileStation.UploadDialog.superclass.constructor.call(this,c);this.upFormArr=[]};Ext.extend(SYNO.FileStation.UploadDialog,SYNO.SDS.ModalWindow,{MaxUploadCount:10,limitSize:2147482624,parentDir:null,uploadCnt:0,upFormArr:[],init:function(){var a=new SYNO.ux.FormPanel({autoFlexcroll:false,trackResetOnLoad:true,labelWidth:200,defaults:{style:"padding-top: 10px"},items:[new SYNO.ux.CompositeField({name:"writestrategyComposite",fieldLabel:_WFT("filetable","filetable_same_file"),items:[{xtype:"syno_radio",boxLabel:_WFT("filetable","filetable_skip"),name:"writestrategy",inputValue:"skip",width:100,checked:true},{xtype:"syno_radio",boxLabel:_WFT("filetable","filetable_overwrite"),name:"writestrategy",inputValue:"overwrite",width:100}]})],listeners:{actionfailed:{fn:this.closeHandler,scope:this}}});this.writeStrategyForm=a;var c=_WFT("filetable","filetable_select_max");c=c.replace("_MAXNO_",this.MaxUploadCount);var b=new Ext.Panel({border:false,autoFlexcroll:true,defaults:{border:false,style:"padding-left: 38px; padding-top: 1px; font-size: 12px"},items:[new SYNO.ux.DisplayField({hideLabel:true,autoScroll:false,value:c}),this.writeStrategyForm]});this.formContainer=b;return b},addUpFileForm:function(){if(this.uploadCnt>=this.MaxUploadCount){return}this.uploadCnt++;var a=new Ext.form.Field({synotype:"indent",itemId:"file",fieldLabel:_WFT("upload","upload_file"),name:"file",hiddenName:"file",hideLabel:true,value:"",autoCreate:{tag:"input",type:"file",size:"20",autocomplete:"off"}});var c={autoFlexcroll:false,url:this.UploadCGI,labelWidth:0,labelAlign:"left",fileUpload:true,trackResetOnLoad:true,border:false,items:[new Ext.form.Field({inputType:"hidden",value:"",name:"overwrite",hiddenName:"overwrite"}),new Ext.form.Field({inputType:"hidden",value:"",name:"taskid",hiddenName:"taskid"}),new Ext.form.Field({inputType:"hidden",value:"/AAtest",name:"path",hiddenName:"path"}),new Ext.form.Field({inputType:"hidden",value:"/AAtest",name:"uploader_name",hiddenName:"uploader_name"}),{xtype:"syno_compositefield",fieldLabel:_WFT("upload","upload_file"),name:"fileComposite",itemId:"fileComposite",items:[a]}]};var d=new SYNO.ux.FormPanel(c);d.fileField=a;this.formContainer.add(d);this.formContainer.doLayout();var b=this.upFormArr.length;this.onFieldChangeFn=function(){this.onFieldChange(b)};d.mon(a.getEl(),"change",this.onFieldChangeFn,this);this.upFormArr.push(d)},closeHandler:function(){this.close()},testFile:function(){var b=0;for(var a=0;a<this.upFormArr.length;a++){var c=this.upFormArr[a].fileField.getValue();c=Ext.util.Format.trim(c);if(c){b++}}return b},submitForm:function(){var a=0;if(1>(a=this.testFile())){this.getMsgBox().alert(_WFT("filetable","filetable_upload"),_WFT("filetable","filetable_select_one"));return}var b="overwrite"===this.writeStrategyForm.form.getValues().writestrategy;this.hide();SYNO.FileStation.FormUploader.initForm(this,this.upFormArr,b,this.parentDir,a,this.uploaderName)},setParameters:function(a,b){this.parentDir=a;this.uploaderName=b},reset:function(a){var b=this.writeStrategyForm.getEl();if(a){b.setStyle("display","none")}else{b.setStyle("display","block")}},load:function(a){this.blDisableWriteOption=a;this.show()},onBrowserFileSize:function(a){var b=this.upFormArr[a].fileField.getEl().dom.files[0];return b.fileSize},onCheckFileSize:function(b){var a=-1;if(Ext.isSafari||Ext.isGecko){a=this.onBrowserFileSize(b)}if(a>this.limitSize){this.getMsgBox().alert(_WFT("filetable","filetable_upload"),_WFT("upload","upload_exceed_maximum_filesize"));this.upFormArr[b].fileField.setValue("");return false}return true},onFieldChange:function(a){if(!this.onCheckFileSize(a)){return}var b=this.upFormArr[this.upFormArr.length-1];var c=b.fileField;b.mun(c.getEl(),"change",this.onFieldChangeFn,this);b.mon(c.getEl(),"change",function(){this.onCheckFileSize(a)},this);this.addUpFileForm()}});Ext.ns("SYNO.FileStation.Action.Uploader");SYNO.FileStation.Action.Uploader.HTML5UploaderMgr=Ext.extend(Object,{constructor:function(a){this.uploader=new SYNO.FileStation.Action.Uploader.Uploader({cfg:this.getCfg(a),htmlcfg:this.getHTML5Cfg(a),btncfg:a.btncfg})},init:function(a){this.uploader.init(a);this.dragovertime=0},getCfg:function(a){return{limitFiles:1000,listeners:this.getUploadListeners(a.owner)}},getHTML5Cfg:function(a){return{url:a.url,filefiledname:"file",instantStart:a.instantStart,listeners:{scope:a.owner,onBeforeDropfile:this.onBeforeDropfile,onDragEnter:this.onDragEnter,onDrop:this.onDrop,onDragEnd:this.onDragEnd,onBeforeDragEnter:this.onBeforeDragEnter,onDragOver:{fn:this.onDragOver,scope:this}}}},getUploadListeners:function(a){return{scope:a,onOpen:this.onOpen,onSelect:this.onSelect,onAllSelect:this.onAllSelect,onError:this.onError,onBeforeBrowse:this.onBeforeBrowse}},onBeforeBrowse:function(b,a){if(_S("demo_mode")===true){this.owner.getMsgBox().alert(_WFT("filetable","filetable_upload"),_JSLIBSTR("uicommon","error_demo"));return false}if(!this.onCheckVFSAction("upload",null,this.getUploadPath(a))){this.owner.getMsgBox().alert(_WFT("filetable","filetable_upload"),_WFT("error","not_support"));return false}if(!this.onCheckPrivilege("upload",null,false,false)){this.owner.getMsgBox().alert(_WFT("filetable","filetable_upload"),_WFT("error","error_privilege_not_enough"));return false}if(a.disabled||1===AppletProgram.blJavaPermission){return false}b.params={path:this.getUploadPath(a)}},onOpen:function(a,b){if(!this.blForceHtmlUpload&&1===AppletProgram.blJavaPermission){return false}this.getUploadInstance().onOpen({id:b.id})},onSelect:function(a,b){if(!this.blForceHtmlUpload&&1===AppletProgram.blJavaPermission){return false}if(!b.params.path){Ext.apply(b.params,{path:this.getCurrentDir()})}this.getUploadInstance().onSelect({id:b.id,name:b.name})},onAllSelect:function(c,b,a){if(!this.blForceHtmlUpload&&1===AppletProgram.blJavaPermission){return false}this.getUploadInstance().onAllSelect(b,a)},onError:function(c,a,b){if(!this.blForceHtmlUpload&&1===AppletProgram.blJavaPermission){return false}if(!b){var d=_WFT("error","error_error_system");if(Ext.isString(a)){d=a}if(SYNO.webfm.utils.isSharingUpload()){this.onUploadFolderError();return false}else{this.owner.getMsgBox().alert(_WFT("filetable","filetable_upload"),d)}return}},onBeforeDropfile:function(h,f,e,a,c){var b=(SYNO.SDS.UserSettings.getProperty("SYNO.SDS.App.PersonalSettings.Instance","enableautooverwrite")===true)?true:false;if(!this.onCheckVFSAction("upload",null,this.getUploadPath())){this.owner.getMsgBox().alert(_WFT("filetable","filetable_upload"),_WFT("error","not_support"));return false}if(!this.onCheckPrivilege("upload",null,false,false)){this.owner.getMsgBox().alert(_WFT("filetable","filetable_upload"),_WFT("error","error_privilege_not_enough"));return false}if(SYNO.webfm.utils.isSharingUpload()){var d=false;if(this.blUploading){return}Ext.each(a.files,function(i){if(i.isDirectory){d=true;return false}});if(d){this.onUploadFolderError();return}}var g=new SYNO.FileStation.DropConfirmDialog({owner:this.owner},{cb:a,filenames:f},c);if(b||SYNO.webfm.utils.isSharingUpload()){g.upload(b)}else{g.show()}},onBeforeDragEnter:function(f,b,d){if(1===AppletProgram.blJavaPermission){if((Ext.isIE||Ext.isModernIE||Ext.isChrome)&&SYNO.SDS.AppMgr){var a=false;var g=SYNO.SDS.AppMgr.getByAppName("SYNO.SDS.App.FileStation3.Instance");if(g.length<1){return false}Ext.each(g,function(e){if(e.window===SYNO.SDS.WindowMgr.getActive()){a=true;return false}});var c;if(a){c=SYNO.SDS.WindowMgr.getActive()}else{c=g[0].window;SYNO.SDS.WindowMgr.bringToFront(c)}if(b.owner.appWindow!==c){return false}}return(b.owner.getCurrentSource()==="remote")}if(b.owner&&b.owner.getCurrentSource()==="remotes"){return false}},onDragEnter:function(c,a){if(!_S("demo_mode")&&1===AppletProgram.blJavaPermission){var b=a.html5cfg.dropppanelapplet;if(b){b.showDropPanel()}return false}},onDragOver:function(c,a){if(!_S("demo_mode")&&1===AppletProgram.blJavaPermission){var b=a.html5cfg.dropppanelapplet;if(b){if(100<new Date().getTime()-this.dragovertime){b.showDropPanel();this.dragovertime=new Date().getTime()}}}},onDrop:function(b,a){b.blFolderEabled=true;if(!_S("demo_mode")&&1===AppletProgram.blJavaPermission){return false}},onDragEnd:function(c,a){if(!_S("demo_mode")&&1===AppletProgram.blJavaPermission){var b=a.html5cfg.dropppanelapplet;if(b&&!b.processing){b.hideDropPanel();this.dragovertime=0}return false}},onRemoveBtnClick:function(a){if(this.uploader){this.uploader.onRemoveBtnClick(a)}},onAddBtnClick:function(a){if(this.uploader){this.uploader.onAddBtnClick(a)}},onAddJavaDropPanel:function(a,b){if(this.uploader){this.uploader.onAddJavaDropPanel(a,b)}}});SYNO.FileStation.Action.Uploader.Uploader=Ext.extend(SYNO.SDS.App.Uploader.Uploader,{constructor:function(a){SYNO.FileStation.Action.Uploader.Uploader.superclass.constructor.apply(this,arguments);this.initContainer(a)},initContainer:function(a){var b=this;this.init=function(c){c.mon(c,"afterlayout",function(d){d.html5cfg={};d.html5cfg.btncfg=a.btncfg;this.initHTML5Uploader(c)},b,{single:true})}},initHTML5Uploader:function(a){this.html5uploader=new SYNO.FileStation.Action.Uploader.HTML5Uploader(Ext.apply({limitFiles:this.opts.limitFiles},this.htmlopts||{}),{container:a,opts:this.opts})},onRemoveBtnClick:function(a){if(this.html5uploader){this.html5uploader.onRemoveBtnClick(a)}},onAddBtnClick:function(a){if(this.html5uploader){this.html5uploader.onAddBtnClick(a)}},onAddJavaDropPanel:function(a,b){if(this.html5uploader){this.html5uploader.onAddJavaDropPanel(a,b)}}});SYNO.FileStation.Action.Uploader.HTML5Uploader=Ext.extend(SYNO.SDS.App.Uploader.HTML5Uploader,{blFolderEabled:true,constructor:function(b,a){this.initDefData();if(!SYNO.FileStation.HTML5Uploader){this.HTMLUploaderTask=new SYNO.SDS.App.Uploader.HTMLUploaderTaskMgr({uploader:this});SYNO.FileStation.HTMLUploaderTaskMgr=this.HTMLUploaderTask}else{this.HTMLUploaderTask=SYNO.FileStation.HTMLUploaderTaskMgr}Ext.apply(this.opts,b);SYNO.SDS.App.Uploader.HTML5Uploader.superclass.constructor.apply(this,arguments);this.init(a);if(!this.blInitListener){this.mon(this,{scope:this,onProgress:this.onProgressFn,onComplete:this.onCompleteFn,onAllComplete:this.onAllCompleteFn,onError:this.onErrorFn,onCompleteFolderFile:this.onCompleteFolderFileFn});this.blInitListener=true}this.webfm=this.opts.listeners.scope;this.folderFiles={}},getUploadInstance:function(){if(!this.uploadGird){this.uploadGird=this.webfm.getUploadInstance()}return this.uploadGird},onProgressFn:function(e,b,d){if(!this.blForceHtmlUpload&&1===AppletProgram.blJavaPermission){return false}var f,a,h;if(b.isSubFile){var c=b.rootObj,g=c.uploadByte,i=c.totalByte;f=Math.floor(((g+d)/i)*100);b.byteswrite=d;a=b.rootObj.name;h=b.params.path.replace(c.params.path+"/","")+"/"+b.name}else{f=(!b.size)?0:Math.floor((d/b.size)*100);a=b.name;h=b.name}if(b.isSubFile||0<f){this.getUploadInstance().onProgressWithTime({id:b.id,byteswrite:d,progress:f,name:a,curname:h,taskInfo:{progress:f,isSubFile:b.isSubFile,complete:(d===b.size)}})}},onCompleteFn:function(c,a,b){if(!this.blForceHtmlUpload&&1===AppletProgram.blJavaPermission){return false}this.getUploadInstance().onComplete({id:b.id,remotedir:b.params.path,isSkip:a.blSkip,name:b.name,isSubFile:b.isSubFile,isSubFolder:b.isSubFolder,rootObj:b.rootObj})},onCompleteFolderFileFn:function(c,a,b){if(this.getUploadInstance().onCompleteFolderFile){this.getUploadInstance().onCompleteFolderFile({id:b.id,size:b.size,rootObj:b.rootObj})}},onAllCompleteFn:function(a){if(!this.blForceHtmlUpload&&1===AppletProgram.blJavaPermission){return false}this.getUploadInstance().onAllComplete()},onErrorFn:function(g,b,e){if(!this.blForceHtmlUpload&&1===AppletProgram.blJavaPermission){return false}if(!e){return}if(e.isSubFile||e.isSubFolder){if(!e.rootObj.errors){e.rootObj.errors=[]}var d;if(b&&b.error&&b.error.code){d=SYNO.webfm.utils.getWebAPIErr(false,b.error)}else{if(b&&b.errno&&b.errno.section&&b.errno.key){var f=b.errno.section,a=b.errno.key;d=_WFT(f,a)||_T(f,a)}else{if(Ext.isString(b)){d=b}else{d=_WFT("common","commfail")}}}var c={name:e.params.path+"/"+e.name,errStr:d};e.rootObj.errors.push(c)}this.getUploadInstance().onError({id:e.id,curname:e.name,response:b,status:e.status,size:e.size,byteswrite:e.byteswrite||0,isSubFile:e.isSubFile,isSubFolder:e.isSubFolder,rootObj:e.rootObj})},initDefData:function(){SYNO.FileStation.Action.Uploader.HTML5Uploader.superclass.initDefData.apply(this,arguments);this.blAppenddata=true;this.btncfgs=[]},init:function(a){SYNO.FileStation.Action.Uploader.HTML5Uploader.superclass.init.apply(this,arguments);a.container.html5cfg.html5uploader=this},onAddJavaDropPanel:function(a,b){if(1===AppletProgram.blJavaPermission){a.html5cfg.dropppanelapplet=new AppletProgram.DropPanel(b)}},onDestroy:function(a){SYNO.FileStation.Action.Uploader.HTML5Uploader.superclass.onDestroy.apply(this,arguments);if(a.html5cfg.skipinputel){Ext.destroy(a.html5cfg.skipinputel)}if(a.html5cfg.overinputel){Ext.destroy(a.html5cfg.overinputel)}if(a.html5cfg.dropppanelapplet){a.html5cfg.dropppanelapplet.onDestroy()}},onCreateInputEl:function(){var b,a=Ext.id();b=document.createElement("input");b.setAttribute("id",a);b.setAttribute("type","file");b.setAttribute("multiple","multiple");b.setAttribute("style","position:absolute;left:-10000px;width:1px;1px;");this.webfm.fireEvent("onAfterCreateInputEl",b);return Ext.getBody().appendChild(b)},onAddSkipBtnClick:function(b,c){var a=b.html5cfg;if(!a.skipinputel){a.skipinputel=this.onCreateInputEl();b.mon(a.skipinputel,"change",function(e,f){this.blFolderEabled=false;this.addFiles.call(this,f.files,true,false,Ext.apply(c,this.params||{}),undefined,false);var d=f.disabled;f.disabled=true;f.value="";f.disabled=d;if(this.webfm.btnRemoteUpload){this.webfm.btnRemoteUpload.focus()}},this)}Ext.each(a.btncfg.skipbtncfg,function(e){var d=e.cmp||Ext.getCmp(e.id);if(d){d.html5cfg={};d.html5cfg.container=b;b.mon(d,"click",this.onClickSkipBtn,this)}},this)},onClickSkipBtn:function(a,b){if(!Ext.isGecko){b.preventDefault()}if(false!==this.fireEvent("onBeforeBrowse",this,a)){a.html5cfg.container.html5cfg.skipinputel.dom.click()}},onRemoveSkipBtnClick:function(a){Ext.each(a.html5cfg.btncfg.skipbtncfg,function(c){var b=c.cmp||Ext.getCmp(c.id);a.mun(b,"click",this.onClickSkipBtn,this)},this)},onAddOvwrBtnClick:function(b,c){var a=b.html5cfg;if(!a.overinputel){a.overinputel=this.onCreateInputEl();b.mon(a.overinputel,"change",function(e,f){this.blFolderEabled=false;this.addFiles.call(this,f.files,true,false,Ext.apply(c,this.params||{}),undefined,false);var d=f.disabled;f.disabled=true;f.value="";f.disabled=d;if(this.webfm.btnRemoteUpload){this.webfm.btnRemoteUpload.focus()}},this)}Ext.each(a.btncfg.ovwrbtncfg,function(e){var d=e.cmp||Ext.getCmp(e.id);if(d){d.html5cfg={};d.html5cfg.container=b;b.mon(d,"click",this.onClickOvwrBtn,this)}},this)},onClickOvwrBtn:function(a,b){if(!Ext.isGecko){b.preventDefault()}if(false!==this.fireEvent("onBeforeBrowse",this,a)){a.html5cfg.container.html5cfg.overinputel.dom.click()}},onRemoveOvwrBtnClick:function(a){Ext.each(a.html5cfg.btncfg.ovwrbtncfg,function(c){var b=c.cmp||Ext.getCmp(c.id);a.mun(b,"click",this.onClickOvwrBtn,this)},this)},onRemoveBtnClick:function(a){this.onRemoveOvwrBtnClick(a);this.onRemoveSkipBtnClick(a)},onAddBtnClick:function(a){this.onAddOvwrBtnClick(a,{overwrite:true});this.onAddSkipBtnClick(a,{overwrite:false})},initFolderFile:function(c,f,b){var e={path:b,overwrite:c.params.overwrite},a=this;var d=function(h){e.mtime=h.lastModifiedDate.getTime();var g=new a.FileObj(h,e);g.id=c.id;g.isSubFile=true;g.rootObj=c;c.totalByte+=h.size;c.fileArr.push(g);if(a.pendingSendFile){a.sendFolderFiles(c);a.pendingSendFile=false}};f.file(d)},sendFolderFiles:function(a){if(a.fileArr[0]){this.sendCheckInfo(a.fileArr[0])}else{this.pendingSendFile=true}},uploadSubFolder:function(b){if(b.creatingDirs.length===0){if(b.fileNum>0){this.sendFolderFiles(b)}else{this.onFinish({blSkip:false},b)}return}if(this.creatingFolder===true){return}var a=b.creatingDirs[0];this.creatingFolder=true;SYNO.API.currentManager.requestAPI("SYNO.FileStation.CreateFolder","create","2",{folder_path:a.relPath,name:a.name,force_parent:false},function(g,f,e,d){this.creatingFolder=false;b.creatingDirs.splice(0,1);b.folderNum--;if(!g){if(!f.errors){this.onError({error:{code:400}},a);return}for(var c=0;c<f.errors.length;c++){if(f.errors[c].code!=414){this.onError({error:{code:f.errors[c].code}},a);return}}}this.uploadSubFolder(b)},this)},countFileNum:function(a,d,c){var b=this;a.readEntries(function(e){if(!e.length){while(d.dirArr.length){var g=d.dirArr.splice(0,1)[0];a=g.createReader();b.countFileNum.call(b,a,d,d.params.path+g.fullPath);d.creatingDirs.push(g)}b.uploadSubFolder.call(b,d);return}for(var f=0;f<e.length;f++){if(e[f].isFile){d.fileNum++;b.initFolderFile(d,e[f],c)}if(e[f].isDirectory){d.folderNum++;e[f].relPath=c;d.dirArr.push(e[f])}}b.countFileNum.call(b,a,d,c)})},preprocFolder:function(a){a.fileNum=0;a.folderNum=0;a.totalByte=0;a.uploadByte=0;a.dirArr=[];a.fileArr=[];a.creatingDirs=[];SYNO.API.currentManager.requestAPI("SYNO.FileStation.CreateFolder","create","2",{folder_path:a.params.path,name:a.name,force_parent:false},function(g,f,e,d){if(!g){for(var c=0;c<f.errors.length;c++){if(f.errors[c].code!=414){this.onError({error:{code:f.errors[c].code}},a);return}}}var b=a.dtItem.createReader();this.countFileNum(b,a,a.params.path+"/"+a.name);this.getUploadInstance().onCompleteRootFolder({id:a.id,remotedir:a.params.path})},this)},onSendFile:function(a){if(a.isDirectory){a.finishedFile=0;this.preprocFolder(a);return}this.sendCheckInfo(a)},sendNextFile:function(b){var c=b.rootObj,d=c.fileArr,a;if(d&&d.length>0){for(a=0;a<d.length;a++){if(d[a]===b){d.splice(a,1)}}if(d.length>0){this.sendCheckInfo(d[0])}}},clearFolderFiles:function(a){a.fileArr=[];a.dirArr=[]},sendCheckInfo:function(a){var b={path:a.params.path,filename:a.name,size:a.size,overwrite:a.params.overwrite};if(!Ext.isEmpty(a.params.sharing_id)){b.sharing_id=a.params.sharing_id;b.uploader_name=a.params.uploader_name;delete b.path;delete a.params.path}this.sendWebAPI({api:"SYNO.FileStation.CheckPermission",method:"write",version:3,params:b,scope:this,callback:function(e,d,c){if(!e){this.onError({error:d},a);return}if(!d.blSkip){this.onUploadFile(a)}else{this.onFinish(d,a)}}})}});SYNO.FileStation.DropConfirmDialog=Ext.extend(SYNO.SDS.ModalWindow,{constructor:function(d,c,b){this.callback=c.cb;var h;var g=c.filenames;var a=(SYNO.SDS.UserSettings.getProperty("SYNO.SDS.App.PersonalSettings.Instance","enableautooverwrite")===true)?true:false;if(g.length==1){var e=g[0];e=e.substring(e.lastIndexOf(((Ext.isWindows)?"\\":"/"))+1);h=String.format(_WFT("upload","upload_one_file"),Ext.util.Format.ellipsis(e,50))}else{h=String.format(_WFT("upload","upload_files"),g.length)}if(b&&b!==""){h+="<br>("+b+")"}var f={owner:d.owner,resizable:false,minimizable:false,maximizable:false,closable:true,stateful:false,buttonAlign:"center",width:500,height:(b&&b!=="")?260:225,footer:true,cls:"x-window-dlg",title:_WFT("filetable","filetable_upload"),items:[{xtype:"syno_displayfield",value:h},{xtype:"syno_checkbox",itemId:"option",checked:a,boxLabel:_WFT("filetable","upload_copy_auto_overwrite")}],fbar:new Ext.Toolbar({defaultType:"syno_button",items:[{text:_WFT("filetable","filetable_overwrite"),scope:this,handler:function(){this.onUpload(true)}},{text:_WFT("filetable","filetable_skip"),scope:this,handler:function(){this.onUpload(false)}}],enableOverflow:false}),keys:[{key:27,fn:this.close,scope:this}],listeners:{afterlayout:{fn:this.center,scope:this,single:true}}};SYNO.FileStation.DropConfirmDialog.superclass.constructor.call(this,f)},onUpload:function(a){var b=this.getComponent("option").getValue();SYNO.SDS.UserSettings.setProperty("SYNO.SDS.App.PersonalSettings.Instance","enableautooverwrite",b);this.upload(a);this.close()},upload:function(a){this.callback.fn.apply(this.callback.scope,[this.callback.files,{overwrite:a}])}});