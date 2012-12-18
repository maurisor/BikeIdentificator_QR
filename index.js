var	httpReq = new XMLHttpRequest();
var	latlon = "";
	

var app = {
    initialize: function() {
			
        this.bindEvents();
    	navigator.geolocation.getCurrentPosition(suc_geo, err_geo);    
		 
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
    	
        app.receivedEvent('deviceready');        
    },

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    scan: function() {
        console.log('scanning');
        try {
            window.plugins.barcodeScanner.scan(function(args) {
                console.log("Scanner result: \n" +
                    "text: " + args.text + "\n" +
                    "format: " + args.format + "\n" +
                    "cancelled: " + args.cancelled + "\n");
				document.getElementById("content").innerHTML = args.text;
				var ptag = "qr="+args.text+latlon;
				document.getElementById("content").innerHTML = ptag;
                getRemoteData("https://riservata.bikeidentificator.com/bike.asp","POST",ptag,"success_bike","error_bike");
                /*
                if (args.format == "QR_CODE") {
                    window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                }
                */
               // document.getElementById("info").innerHTML = args.text;
                console.log(args);
        });
        } catch (ex) {
            console.log(ex.message);
        }
    }

};
function suc_geo(p) {	  latlon = "&lon="+p.coords.longitude+"&lat="+p.coords.latitude; 	};
function err_geo() 	{	};
function handleStateChange() {if (httpReq.readyState != 4)return;	};
function getRemoteData(url,metod,data,fnsuccess,fnfail) { 
		try {
			httpReq.onreadystatechange = handleStateChange;	
			httpReq.open(metod, url, false);
			httpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			httpReq.send(data);
			if (httpReq.readyState == 4 && httpReq.status == 200) {			
				if ( fnsuccess != null)	eval(fnsuccess+'(httpReq.responseText)') ;				
				return null;
			} else {
				if ( fnfail != null)  eval(fnfail+'()') 			
				return null;			
			}
		} catch (ex) {
			 eval(fnfail+'("errore di connessione:'+ex.message+'")') 
			return null;
		}
	};
function  error_bike(e) { document.getElementById('content').innerHTML= 'Non riusciamo ad attivare la connessione dati, controlla di avere copertura telefonica e di essere abilitato alla navigazione. '+e;		};
function success_bike(rdata) {document.getElementById('content').innerHTML= rdata;};



