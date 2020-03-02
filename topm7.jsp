<%@ page contentType = "text/html; charset=euc-kr" %>
<%
	String s_id		= (String)session.getAttribute("AgentId");
	String LoginID	= (String)session.getAttribute("SabeonId");
	String AgentName	= (String)session.getAttribute("AgentName");
	String sCampgNo		= (String)session.getAttribute("CampgNo");
	String sCampaignno		= (String)session.getAttribute("CampaignNo");
	String LineNumber = (String)session.getAttribute("Line");
%>

<Html>
<Head>
<title></title>
<meta http-equiv="Content-Type" content="text/html; charset=euc-kr">
<link href="../../top/include/css/css.css" rel="stylesheet" type="text/css">
<script src="../../include/Function.js" type="text/JavaScript"></script>

<SCRIPT LANGUAGE="JavaScript">
var Debug = false;
var ImageCount=17;	
var preload_image = new Array();
var preload_change = new Array();
var historywindow_Cnt = 0;
var historywindow_MAX = 1;
var g_bLogin = 0;
var	g_TelNo = "";		// 전화번호
var g_IsOnline = 0;
var g_bHoldCall = 0;

	g_InOutBound = 0;	//============================== 인아웃 바운드 구분 INBOUND:0 OUTBOUND:1
	// 반환값
	CTI_SUCCESS		= 0;
	CTI_FAIL		= -1;

	function preloadImage(){
		if (document.images) { 

			preload_change[0] = new Image(55,47); 
			preload_change[0].src="../../image/menu21_on.gif"; //logout on
			
			preload_change[21] = new Image(55,47); 
			preload_change[21].src="../../image/menu21_off.gif"; //logout off
						
			preload_change[1] = new Image(55,47); 
			preload_change[1].src="../../image/workend_on.gif";			
			
					
			preload_change[20] = new Image(55,47); 
			preload_change[20].src="../../image/workend_off.gif";	
						
			preload_change[2] = new Image(55,47); 
			preload_change[2].src="../../image/breakend_on.gif";					
			
			preload_change[6] = new Image(55,47); 
			preload_change[6].src="../../image/menu27_on.gif";				
						
			preload_change[13] = new Image(55,47); 
			preload_change[13].src="../../image/redial.gif";										
								
			for(var i=1;i<=ImageCount;i++){
				preload_image[i] = new Image(55,47); 
				preload_image[i].src="../../image/menu"+i+"_off.gif";
				
			}
					
			for(var i=1;i<=ImageCount;i++){
				preload_image[i+ImageCount] = new Image(55,47); 
				preload_image[i+ImageCount].src="../../image/menu"+i+"_on.gif";
			}					
			
		}
		for(var i=1;i<=ImageCount;i++){
			
			if(document.all.st[i-1].state>0){
				
				document.all.st[i-1].src = preload_image[i+ImageCount].src;	
				document.all.st[i-1].style.cursor='hand';
			}else{
				document.all.st[i-1].src = preload_image[i].src;	
			}
		}
		
	}		
	function StartAni()
	{
			document.all.st[12].src=preload_change[13].src		
	}	
	function StopAni()
	{
			document.all.st[12].src=preload_image[13+ImageCount].src	
	}	
	function OverImage(val){

	}
	function OutImage(val){

	}
	function EnabledImage(val)
	{
		if( val==1 && document.all.st[0].state==2){
			document.all.st[val-1].src = preload_change[0].src;	
		}else if( val==2 && document.all.st[1].state==2){	
			document.all.st[val-1].src = preload_change[1].src;	
		}else{
			document.all.st[val-1].src = preload_image[val+ImageCount].src;	
			document.all.st[val-1].state = 1;
		}
		document.all.st[val-1].style.cursor='hand';
	}
	function DisabledImage(val)
	{
		if(val==1){
			if(  document.all.st[0].state==2){
				document.all.st[0].src = preload_change[21].src;				
			}
		}else if(val==2 && document.all.st[1].state==2){
				document.all.st[1].src = preload_change[20].src;				
						
		}else{
			document.all.st[val-1].src = preload_image[val].src;	
		}
			document.all.st[val-1].style.cursor='';
			document.all.st[val-1].state = 0;
	}	

	function ChangeImage(pos,val){
			//val 0 : change 1: origin
		try{
			if(pos==1){ //login
				if(val==0){
					document.all.st[0].src = preload_change[0].src;
					document.all.st[0].state = 2;
				}else{
					document.all.st[0].src = preload_image[1+ImageCount].src;
					document.all.st[0].state = 1;
				}
			}else{
				//2 : work 3: break
				if(val==0){
					if( document.all.st[pos-1].src != preload_change[pos-1].src ){
						document.all.st[pos-1].src = preload_change[pos-1].src;
						document.all.st[pos-1].state = 2;
					}
				}else{
					if( document.all.st[pos-1].src != preload_image[pos+ImageCount].src ){
						document.all.st[pos-1].src = preload_image[pos+ImageCount].src;			
						document.all.st[pos-1].state = 1;
					}
				}			
			} 
		}catch(e){}
	}

	
	function OnLoad()
	{
		OnOcxLoad();
	}

	var nRet = 0;
	function OnOcxLoad()
	{
		preloadImage();

		nRet = MitelAgent.CTILogin("192.168.6.15", '<%=LineNumber%>', '<%=s_id%>');
		if ( nRet != CTI_SUCCESS )
		{
			if (nRet < 0) {
				alert("CTI 서버에 접속 할 수 없습니다.!(전화번호, 상담원ID를 확인하세요) = " +  nRet);
			}
			else
			{
				alert("CTI 서버에 접속 할 수 없습니다.!(" + MitelAgent.GetMitelText(2012,nRet) + ")");
			}
			return;
		}
		else
		{
			ChangeImage(1,0);
			g_bLogin = true;
		}

		MitelAgent.attachEvent("CTIEvent", OnPBXEvent);			// 전화 이벤트

		EnabledImage(1);
		if (MitelAgent.QueryDNState('<%=LineNumber%>',1) == 1)
		{
			Agtinfo.innerText = "휴식중";
			EnabledImage(2);
		}
		else
		{
			Agtinfo.innerText = "업무중";
			EnabledImage(3);
		}
		EnabledImage(4);
		EnabledImage(5);
		EnabledImage(6);
		EnabledImage(7);
		
		return true;
	}

	var bPress = false;
	function FnCall(cmd){
		if( cmd<11 ) {
			if( document.all.st[cmd-1].state==0 ) return;
		}
			
		if(bPress) return;	
				
		try 
		{
			bPress = true;
			
			switch (cmd)
			{
			// 로그인/로그아웃
			case 1:
				if (g_bLogin)
				{
					Cti_LogOut();
					top.window.location = "../../";
				}
				else
				{
					Cti_Login();
				}
				break;
			// 업무
			case 2:
				Cti_Ready();
				break;
			// 휴식
			case 3:
				Cti_NotReady();
				break;
			// 전화 걸기
			case 4:
				OpenSubWindow("../cti/Dial.jsp", "wndDail", "width=220, height=50, Toolbar=No, resizable=0");
				break;
			// 전화 끊기
			case 5:
				Cti_HangUp();
				break;
			// 전화 받기
			case 6:
				Cti_Answer();
				break;
			// 보류
			case 7:
				if( g_bHoldCall == 0 )	
				{
					Cti_Hold();
				}
				else
				{
					Cti_UnHold();
				}
				break;
			// 호전환
			case 8:
				CTI_Consultation();
				break;
			// 컨설트
			case 9:
				CTI_MakeConf();
				break;
			// 호 회수
			case 10:
				CTI_CansConsCall();
				//CTI_SplitConf();
				break;
			// 컨퍼런스
			case 11:
				CTI_MakeConf();
				break;
			// 캠페인
			case 12:
				try{
					parent.ifm.SwitchMainTab(2);
				}catch(e){}
				break;			
			case 13: //고객조회
				try{
					parent.ifm.SwitchMainTab(1);
					parent.ifm.js_goCustSub('04');
				}catch(e){}
				break;				
			case 14: //재통화
				try{
					StopAni();
					parent.ifm.js_goRetrySearch();
				}catch(e){}
				break;	
			case 15:	//녹음조회
				break;			
			// 고객등록
			case 16:
				jsGoCustNew();
				break;
			// 공지사항
			case 17:
				jsGoNotice();
				break;
			// 게시판
			case 18:
				jsGoBoard();
				break;
			}
		}
		catch(e)
		{}
		finally 
		{ bPress = false;}
	}

/*
#define AccountCodeSetEvent		3022
#define ACD2PathEvent			3030
#define ACD2GroupEvent			3031  
#define ACDAgentFeatureEvent		3028
#define ActivateFeatureEvent		3027
#define	CallClearedEvent		3001
#define	CallConferencedEvent		3002
#define	CallDeliveredEvent		3003
#define	CallDivertedEvent		3004
#define	CallEstablishedEvent		3005
#define	CallFailedEvent			3006
#define	CallHeldEvent			3007
#define	CallOriginatedEvent		3008
#define	CallQueuedEvent			3009
#define	CallReceivedEvent		3010
#define	CallRetrievedEvent		3011
#define	CallTransferredEvent		3012
#define CmdResponseEvent		3021
#define	ConferenceHeldEvent		3020
#define ConferenceFeatureEvent	3024
#define	DeviceDroppedEvent		3013
#define	ExtensionInUseEvent		3014
#define ForwardFeatureEvent		3029
#define	InServiceEvent			3015
#define	MonitorSetEvent			3016
#define	OutOfServiceEvent		3017
#define RemotePartyUpdateEvent	3025
#define ResilientDeviceEvent	3026
#define RoutingDeviceEvent		3023
#define WorkTimerExpiredEvent		3018
*/

	function OnPBXEvent(val)
	{
		//alert(val);
		switch(val)
		{
			case 3001:			//CallClearedEvent
				custinfo.innerText = "전화끊어짐";
				if (g_IsOnline != 0) {
					Cti_DailTime_DisConn();
					if (g_InOutBound == 0)  MitelAgent.MakeBusySet(1);		//****20110927****  인바운드일 경우 자동으로 이력 저장이 끝날때 까지 Busy로 셋팅.
					setTimeout("HistorySave(0)", 500*1);
				//	HistorySave(0);			//이력저장
					if (g_InOutBound == 0)  
						setTimeout("MitelAgent.MakeBusyCancel()", 1000*1);		//****20110927****  인바운드일 경우 이력 저장이 끝나면 다음 콜 받을수 있도록 셋팅.
				}
				g_IsOnline = 0;			//전화가 끊어짐
				EnabledImage(4);		//전화걸기 버튼 활성화
				DisabledImage(5);		//전화끊기 버튼 비활성화

				DisabledImage(8);		//호전환 버튼 비활성화
				DisabledImage(9);		//컨설트 버튼 비활성화
				DisabledImage(10);		//호회수 버튼 비활성화

				parent.ifm.hissave.value = "0";  // 메인폼 플래그 초기화
				break;
			case 3008:			//CallOriginatedEvent
				custinfo.innerText = "전화걸기시작";
				if (g_IsOnline == 1) {
					Cti_DailTime_DisConn();
					if (g_InOutBound == 0)  MitelAgent.MakeBusySet(1);		//****20110927****  인바운드일 경우 자동으로 이력 저장이 끝날때 까지 Busy로 셋팅.
					setTimeout("HistorySave(0)", 500*1);
				//	HistorySave(0);			//이력저장
					if (g_InOutBound == 0)  
						setTimeout("MitelAgent.MakeBusyCancel()", 1000*1);		//****20110927****  인바운드일 경우 이력 저장이 끝나면 다음 콜 받을수 있도록 셋팅.
					g_IsOnline = 0;			//전화가 끊어짐
				}
				EnabledImage(5);		//전화끊기 버튼 활성화
				DisabledImage(4);		//전화걸기 버튼 비활성화
				parent.ifm.hissave.value = "0";  // 메인폼 플래그 초기화
				break;
			case 3028:			//ACDAgentFeatureEvent
				custinfo.innerText = "상담원상태변경";
				if ( MitelAgent.GetLastArgu(1) == "") {
					Agtinfo.innerText = "로그아웃:" + MitelAgent.GetLastArgu(1);
				} else {
					Agtinfo.innerText = "로그인:" + MitelAgent.GetLastArgu(1);
				}
				break;
			case 3027:			//ActivateFeatureEvent
				custinfo.innerText = "대기상태변경";
				if (MitelAgent.QueryDNState('<%=LineNumber%>',1) == 1)
				{
					Agtinfo.innerText = "휴식중";
					EnabledImage(2);
					DisabledImage(3);
				}
				else
				{
					Agtinfo.innerText = "업무중";
					DisabledImage(2);
					EnabledImage(3);
				}
				break;
			case 3003:			//CallDeliveredEvent
				custinfo.innerText = "전화배달";
				g_InOutBound = 1;			//****20110927****   전화를 걸고 있다  즉 아웃바운드이다.
				if (g_IsOnline == 0)  g_IsOnline = 2;	
				parent.ifm.hissave.value = "3";  // 메인폼 플래그
				break;
			case 3004:			//CallDivertedEvent
				custinfo.innerText = "경로변경";
				break;
			case 3005:			//CallEstablishedEvent
				custinfo.innerText = "전화연결됨";
				
				if (g_IsOnline == 3) {		//Establish 상태에서 Establish 가 또 왔다면 Consult 콜이다.
					CTI_Transfer();
					g_IsOnline = 4;
					break;
				}
				else if (g_IsOnline == 7) {		//Establish 상태에서 Establish 가 또 왔다면 Consult 콜이다.
					CTI_Conference();
					g_IsOnline = 8;
					break;
				}

				g_IsOnline = 1;		//전화가 연결됨
				if ( g_InOutBound == 0 && MitelAgent.GetLastArgu(1) != "")
				{
					parent.ifm.getCustomInfo(MitelAgent.GetLastArgu(1));		// 전화 걸려온 놈의 ANI
				}
				parent.ifm.hissave.value = "3";  // 메인폼 플래그
				Cti_DailTime_Conn();
				DisabledImage(4);		//전화걸기 버튼 비활성화
				EnabledImage(5);		//전화끊기 버튼 활성화
				EnabledImage(8);
				EnabledImage(9);		//컨설트 버튼 활성화
				break;
			case 3012:			//CallTransferredEvent  호전환이 되면 호는 끊어진다.
				custinfo.innerText = "호전환됨";
				if (g_IsOnline != 0) {
					Cti_DailTime_DisConn();

					if (g_InOutBound == 0)  MitelAgent.MakeBusySet(1);		//****20110927****  인바운드일 경우 자동으로 이력 저장이 끝날때 까지 Busy로 셋팅.
					setTimeout("HistorySave(0)", 500*1);
				//	HistorySave(0);			//이력저장
					if (g_InOutBound == 0)  
						setTimeout("MitelAgent.MakeBusyCancel()", 1000*1);		//****20110927****  인바운드일 경우 이력 저장이 끝나면 다음 콜 받을수 있도록 셋팅.
				}
				g_IsOnline = 0;			//전화가 끊어짐
				EnabledImage(4);		//전화걸기 버튼 활성화
				DisabledImage(5);		//전화끊기 버튼 비활성화
				DisabledImage(8);
				DisabledImage(9);		//컨설트 버튼 비활성화
				DisabledImage(10);		//호회수 버튼 비활성화
				parent.ifm.hissave.value = "0";  // 메인폼 플래그 초기화
				break;
			case 3010:			//CallReceivedEvent
				g_InOutBound = 0;			//****20110927****  전화가 수신되었다 즉 인바운드이다.
				custinfo.innerText = "전화수신중";
				break;
			case 3006:			//CallFailedEvent
				custinfo.innerText = "전화 실패";
				break;
			case 3007:			//CallFailedEvent
				custinfo.innerText = "전화 보류";
				break;
			case 3016:			//MonitorSetEvent
				custinfo.innerText = "정상 등록";
				break;
			case 3013:			//MonitorSetEvent
				custinfo.innerText = "전화 제거됨";
				break;
			case 3030:			//ACD2PathEvent
			case 3031:			//ACD2GroupEvent
				custinfo.innerText = "호출자:" + MitelAgent.GetLastArgu(1);
				break;
		}
	}

	function js_dodial( telnum, iType )
	{
		var nRet = 0;
		//alert(telnum);

		if ( !g_bLogin )
		{
			alert("먼저 로그인 해 주세요!");
			return;
		}

		if ( telnum.substring(0, 2) == '02' )
		{
			telnum = telnum.substring(2, telnum.length);
		}

		if ( telnum == "" )
		{
			return;
		}

		g_TelNo = telnum;
		telnum = '8' + telnum;
		//alert(telnum);

		// 1 : 바로 걸기, 전화번호
		nRet = MitelAgent.MakeCall(telnum);
		
		if ( nRet != 0)
		{
			alert( "전화 걸기 실패");
		}
	}

	function jsGoCustNew()
	{
		OpenSubWindow( "../../tmagent/cust/cst_new.jsp","cst","left=200,top=200,width=750, height=250,Toolbar=No, resizable=0, scrollbars=No, status=Yes");	
	}
	function jsGoNotice() {
		OpenSubWindow( "../../tmmgr/notice/NoticeMain.jsp","Notice","left=200,top=200,width=750, height=600,Toolbar=No, resizable=0, scrollbars=Yes");
	}	
	function jsGoBoard() {
		OpenSubWindow( "../../tmagent/board/list.jsp","Board","left=200,top=200,width=750, height=600,Toolbar=No, resizable=0, scrollbars=Yes");		
	}	
	function jsRetryPopup(RevCstName,RevCnt) {
		OpenSubWindow( "./top_popup.jsp?RevCstName="+RevCstName+"&RevCnt="+RevCnt,"Notice","left=200,top=200,width=200, height=150,Toolbar=No, resizable=0, scrollbars=Yes");
	}
	function DialogData() {
		var mode;
		var select2;
		var select3;
		var select4;
		var selectName2;
		var selectName3;
		var selectName4;    
		var sel;
		var ymd;
		var hh;
		var mm;
		var memo;
		var hisok;
	}																					

	var inout = '';	
	function 	HistorySave(mode)
	{
		parent.ifm_top.DialogData.selectName3 = '';

		//상담원이 통화하지 않고 이력저장만 하는 경우 mode == 1
		parent.ifm.hissave.value = "1";
		parent.ifm.ShowMsg2(true);
		if( parent.ifm.frm.arIDX.value == "" )
		{
			alert("고객 ID가 없어서 저장할 수 없습니다.(2)");
			parent.ifm.ShowMsg2(false);
			return;
		}
		//고객정보 메인에서 저장
		//parent.ifm.jsModify2();
		if( g_dialtime > 6000 ) g_dialtime=0;

		inout = '2';
		
		var campaign_new = parent.ifm.frm.arCampNo.value;

		if(campaign_new == '' ){
			campaign_new = '<%=sCampaignno%>';
		}
		
		var szURL = "cst_history_in.jsp?Mode="+mode+"&CstContactSts=01060002&CampaignNo="+campaign_new;

		DialogData.mode = mode;
		
		var result = window.showModalDialog(szURL,DialogData, "dialogHide:hide;center:yes;dialogWidth:500px;dialogHeight:400px;status=no;resizable=no;");
					var szURL  = "cst_history_in_savem.jsp?sel=" + DialogData.sel +
									"&select2=" + DialogData.select2 +
									"&select3=" + DialogData.select3 +
									"&select4=" + DialogData.select4 +
									"&selectName2=" + DialogData.selectName2 +
									"&selectName3=" + DialogData.selectName3 +
									"&selectName4=" + DialogData.selectName4 +
									"&CstId=" + parent.ifm.frm.arIDX.value +
									"&HCstId=" + parent.ifm.frm.custIdx.value +
									"&arFrom=" + parent.ifm.frm.arFrom.value +
									"&reIDX=" + parent.ifm.frm.RetryIdx.value +
									"&SabeonId=<%=LoginID%>"+
									"&CstTel1=" + g_TelNo +
									"&CstTel2=" + 
									"&CstTel3=" + 
									"&CstJuminNo=" + parent.ifm.jumin1.value+parent.ifm.hiddenjumin.value +
									"&CstName=" + parent.ifm.cname.value +
									"&CampName=" + parent.ifm.campname.value +
									"&DialTime=" + g_dialtime +
									"&RecFileName=" + 
									"&CstContactSts=01060002" + 
									"&CampaignNo=" + campaign_new +
									"&ymd=" + DialogData.ymd +
									"&hh=" + DialogData.hh +
									"&mm=" + DialogData.mm +
									"&memo=" + DialogData.memo+
									"&inout=" + inout+
									"&judgestatus=" + parent.ifm.judgevalue.value+
									"&mode="+mode;
									
			
		if ( mode==1) { //이력 상태 변경만..
				if( result )
					parent.ifm.ifm_Trans.location =szURL;
					g_dialtime=0;
		}else{
			if(historywindow_Cnt < historywindow_MAX)
			{		
				if (result){
					parent.ifm.ifm_Trans.location =szURL;
					g_dialtime=0;
				}else{
					alert('이력저장을 반드시 해야 합니다.!'+historywindow_Cnt);
					historywindow_Cnt++;
					HistorySave(mode);				
				}
			}
			historywindow_Cnt = 0;
			if(parent.ifm.hissave.value != 2)
			{
				parent.ifm.ShowMsg2(false);
				parent.ifm.hissave.value = "0";
			}
		}
	}

	var g_fromtime=0;
	var g_totime=0;
	var g_dialtime=0;
	var gTimerID_Dial="";
	var nRet = 0;

	function Cti_DailTime_Conn()
	{
		g_fromtime = Math.round(new Date().getTime()/1000);
		
		gTimerID_Dial = window.setInterval('CheckTimer_DialTime()','1000');
	}

	function Cti_DailTime_DisConn()
	{	
		if( gTimerID_Dial != "" )
		{
			window.clearInterval(gTimerID_Dial);
			gTimerID_Dial = "";
		}
		
		if(g_dialtime == 0 )
		{
			g_totime = Math.round(new Date().getTime()/1000);
			g_dialtime = g_totime - g_fromtime;
		}
		g_totime = 0;
		g_fromtime = 0;
		dial_nowtime.innerText = "";
	}
	//통화시간 타이머 - 현재 통화 시간을 표시해준다.
	function CheckTimer_DialTime()
	{
		var iTime = 0;
		var szTemp = "";
		var szTemp2 = "";

		if( g_dialtime== 0 )
		{
			//frmTop.totime.value = Math.round(new Date().getTime()/1000);
			iTime = Math.round(new Date().getTime()/1000) - g_fromtime;

			szTemp2 = (iTime % 60) + "";
				
			if( szTemp2.length < 2 )
				szTemp2 = "0" + szTemp2;
				
			szTemp = parseInt(iTime / 60) + ":" + szTemp2;
					
			dial_nowtime.innerText = "통화 시간 ( " + szTemp + " )";	
		}
		else
		{
			if( gTimerID_Dial != "" )
			{
				window.clearInterval(gTimerID_Dial);
				gTimerID_Dial = "";
			}
		}		
	}

    /* CTI에 로그인한다.    */
    function Cti_Login(){
        nRet = MitelAgent.ACDLogin( '<%=session.getAttribute("AgentId")%>');

	  if ( nRet != CTI_SUCCESS )
	  {
			alert( "로그인을 실패했습니다.(" + MitelAgent.GetMitelText(2012,nRet) + ")" );
	  }
	  else
	  {
			ChangeImage(1,0);		
			g_bLogin = true;
	  }
    }

    /* CTI에서 로그아웃한다.    */
    function Cti_LogOut(){
        if ( g_bLogin )
		{
			nRet = MitelAgent.ACDLogout('<%=session.getAttribute("AgentId")%>');
			g_bLogin = false;
			ChangeImage(1,1);		
		}
    }

	/* CTI에서 전체 로그아웃한다.    */
    function PBX_LogOut(){
			nRet = MitelAgent.CTILogout();
    }

    /* 상담원 상태를 대기상태로 한다    */
    function Cti_Ready(){
        nRet = MitelAgent.DNDCancel();
	   if ( nRet != CTI_SUCCESS )
	   {
			alert("휴식 종료 실패");				//TEST ADS
	   }
    }

    /* 상담원 상태를 이석상태로 한다.        form1.Reason.Value (이석사유)
    */
    function Cti_NotReady(){
        nRet = MitelAgent.DNDSet();
		if ( nRet != CTI_SUCCESS )
		{
			alert("휴식 실패");				//TEST ADS
		}
    }

    /* 전화통화를 종료한다.    */
    function Cti_HangUp(){
        nRet = MitelAgent.ClearCall();
    }

    /* 전화를 받는다    */
    function Cti_Answer(){
        nRet = MitelAgent.AnswerCall();

	   if ( nRet != CTI_SUCCESS )
	   {
			alert("전화 받기 실패");
			return;
	   }
    }

    /* 전화통화중 고객의 통화를 보류한다.    */
    function Cti_Hold(){

        nRet = MitelAgent.HoldCall();

		if ( nRet != CTI_SUCCESS )
		{
			alert("보류 실패");
			return;
		}   
		else
		{
			ChangeImage(7,0);	
			g_bHoldCall = 1;
		}
    }

    /* 보류를 해제한다.    */
    function Cti_UnHold(){
       nRet = MitelAgent.RetrieveCall();

	   if ( nRet != CTI_SUCCESS )
	   {
			alert("보류해제 실패");
			return;
	   } 
	   else
		{
			ChangeImage(7,1);
			g_bHoldCall = 0;
		}
    }

    //컨설트 ( 2자통화 ) 
	function CTI_Consultation()
	{
	   nRet = MitelAgent.ConsultationCall("915990622");
	   g_IsOnline = 3;
	   EnabledImage(10);		//호회수 버튼 활성화
	   if ( nRet != CTI_SUCCESS )
	   {
			alert("컨설트 실패");
			return;
	   }
	}

	//3자통화 
	function CTI_MakeConf()
	{
		nRet = MitelAgent.ConsultationCall("915990622");
	   g_IsOnline = 7;
	   EnabledImage(10);		//호회수 버튼 활성화
	   if ( nRet != CTI_SUCCESS )
	   {
			alert("컨설트 실패");
			return;
	   }
	}

	//호전환 
	function CTI_Transfer()
	{
		nRet = MitelAgent.TransferCall();

		if ( nRet != CTI_SUCCESS )
		{
			alert("호전환  실패");
			return;
		} 
	}

	//호회수 
	function CTI_CansConsCall()
	{
		nRet = MitelAgent.CancelConsCall();

		if ( nRet != CTI_SUCCESS )
		{
			alert("호회수  실패");
			return;
		} 
	}

	//3자통화 
	function CTI_Conference()
	{
		nRet = MitelAgent.ConfCall();

		if ( nRet != CTI_SUCCESS )
		{
			alert("3자통화  실패");
			return;
		} 
	}

	//3자통화 해제
	function CTI_SplitConf()
	{
		nRet = MitelAgent.SplitConfCall();

		if ( nRet != CTI_SUCCESS )
		{
			alert("3자통화 분리 실패");
			return;
		} 
	}

	function js_pwd()
	{
			window.open( "../../tmagent/cust/pwd.jsp?SabeonId=<%=session.getAttribute("SabeonId")%>" , "pwdWin", "width=328,height=225,status=no,resizable=no,Toolbar=No");
	}	
</script>
<script language='vbscript'>
Sub Window_OnUnLoad()
	call execScript("PBX_LogOut()","Javascript")
End Sub 
</script>

</head>

<body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" onLoad="OnLoad()" >
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<form name="frmTop">
<input type="hidden" name=testcnt value=0>
	<input type="hidden" name="chIdx" value="">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<tr><td height="1" bgcolor="42B5E7"></td></tr>
	<tr><td height="1" bgcolor="187C9E"></td></tr>
	<tr><td height="1" bgcolor="31B5E1"></td></tr>
	<tr>
		<td valign="top">
			<table border="0" cellspacing="0" cellpadding="0" width="100%" background="../../image/top_bg.gif">
				<tr>
					<td valign="top" align="left">
						<table border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="15"></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu1_off.gif' state=0 onmouseover="OverImage(1)" onmouseout="OutImage(1)" onclick="FnCall(1)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu2_off.gif' state=0 onmouseover="OverImage(2)" onmouseout="OutImage(2)" onclick="FnCall(2)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu3_off.gif' state=0 onmouseover="OverImage(3)" onmouseout="OutImage(3)" onclick="FnCall(3)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu4_off.gif' state=0 onmouseover="OverImage(4)" onmouseout="OutImage(4)" onclick="FnCall(4)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu5_off.gif' state=0 onmouseover="OverImage(5)" onmouseout="OutImage(5)" onclick="FnCall(5)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu6_off.gif' state=0 onmouseover="OverImage(6)" onmouseout="OutImage(6)" onclick="FnCall(6)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu7_off.gif' state=0 onmouseover="OverImage(7)" onmouseout="OutImage(7)" onclick="FnCall(7)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu8_off.gif' state=0 onmouseover="OverImage(8)" onmouseout="OutImage(8)" onclick="FnCall(8)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu9_off.gif' state=0 onmouseover="OverImage(9)" onmouseout="OutImage(9)" onclick="FnCall(9)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>       
								<td><img id="st" src='../../image/menu10_off.gif' state=0 onmouseover="OverImage(10)" onmouseout="OutImage(10)" onclick="FnCall(10)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu11_on.gif' state=1 onmouseover="OverImage(12)" onmouseout="OutImage(12)" onclick="FnCall(12)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu12_on.gif' state=1 onmouseover="OverImage(13)" onmouseout="OutImage(13)" onclick="FnCall(13)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu13_on.gif' state=1 onmouseover="OverImage(14)" onmouseout="OutImage(14)" onclick="FnCall(14)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu14_off.gif' state=0 onmouseover="OverImage(15)" onmouseout="OutImage(15)" onclick="FnCall(15)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu15_on.gif' state=1 onmouseover="OverImage(16)" onmouseout="OutImage(16)" onclick="FnCall(16)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>
								<td><img id="st" src='../../image/menu16_on.gif' state=1 onmouseover="OverImage(17)" onmouseout="OutImage(17)" onclick="FnCall(17)" width=55 height=47></td>
								<td><IMG SRC="../../image/top_space.gif" WIDTH="1" HEIGHT="47" BORDER="0" ALT=""></td>                      
								<td><img id="st" src='../../image/menu17_on.gif' state=1 onmouseover="OverImage(18)" onmouseout="OutImage(18)" onclick="FnCall(18)" width=55 height=47></td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr><td height="1" bgcolor="2084BB"></td></tr>
	<tr><td height="1" bgcolor="187C9E"></td></tr>
</form>

	<tr>
		<td>
			<table border="0" cellspacing="0" cellpadding="0" bgcolor="F0F0F0" width="100%">
				<tr><td height="5"></td></tr>
				<tr>
					<td WIDTH="7"></td>
					<td><div id='btnStateMsg'></div></td>
					<td align="left" WIDTH="150"><div id="custinfo"></div></td>
					<td align="left" WIDTH="100"><div id="Agtinfo"></div></td>
					<td align="left" WIDTH="150"><div id="dial_nowtime"></div></td>
					<td align="right" width=500>
						사용자 : 
						<font color=blue><b><%=session.getAttribute("AgentName")%></b></font>
						(<%=session.getAttribute("SabeonId")%> / <%=session.getAttribute("AgentId")%>) &nbsp; 						
						(내선번호:<%=session.getAttribute("Line")%>) &nbsp; 
						Ver 1.0.1
						<a href="javascript:js_pwd()"><IMG SRC="../../image/button/pwd.gif" align='absmiddle'></a>
					</td>
					<td width=50>
					</td>
				</tr>
				<tr><td height="5"></td></tr>
			</table>
		</td>
	</tr>
</table>	
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<form name="frm">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
	<input type="hidden" name="menu" value="off">
</form>
	<tr><td height="1" bgcolor="42B5E7"></td></tr>
	<tr><td height="1" bgcolor="187C9E"></td></tr>
	<tr><td height="1" bgcolor="31B5E1"></td></tr>
	<tr>
		<td valign="top">
			<iframe name="ifm_retry" src="" width="0" height="0" frameborder="0" scrolling="no"></iframe>
		</td>
	</tr>
	<tr><td height="1" bgcolor="2084BB"></td></tr>
	<tr><td height="1" bgcolor="187C9E"></td></tr>
</table>

<OBJECT id="MitelAgent"
classid="CLSID:1134EB7D-5ACA-47E2-A352-8D9EDE49C2AA" 
codebase="../../ocx/MitAgent.cab#version=1,0,0,1"
 width="100" 
 height="100">
 <B>MitelAgent Control failed to load.</B>
</OBJECT>
&nbsp;
</body>
</html>