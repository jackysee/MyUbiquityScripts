CmdUtils.CreateCommand({
	name: "ydict",
	author: { name: "Jacky", email: "jackysee at gmail dot com"}, 
	description: "Search HK Yahoo dict",
	help: "Select the text or just type as the parameter",
	takes: { "word": noun_arb_text },
	execute: function(word){
		var url = "http://hk.dictionary.yahoo.com/search.html";
		var params = Utils.paramsToString({q:"1", s:word.text});
		Utils.openUrlInBrowser(url + params);
	},
	preview: function(pblock, word){
		pblock.innerHTML = CmdUtils.renderTemplate("Search HK Yahoo Dict for <b>${word}</b>...", {word:word.text});
		if(word.text){
			var url = "http://hk.dictionary.yahoo.com/search.html";
			var params = Utils.paramsToString({q:"1", s:word.text.toLowerCase()});
			Utils.ajaxGet(url + params, function(xml){
				CmdUtils.loadJQuery(function(){
					var $ = window.jQuery;
					var data = "";
					if(xml.indexOf('<div class=pexplain>')!=-1){
						var startIndex = xml.indexOf('<div class=pcixin>');
						startIndex = startIndex == -1? xml.indexOf("<div class=pexplain>"):startIndex;
						data = xml.substring(startIndex);
						data = data.substring(0, data.indexOf('<table'));
						data = data.replace(/class=(pchi|peng)/g,"style='display:none'");
						data = data.replace(/class=pexplain/g,"style='margin-left:2em'");     
						pblock.innerHTML += '<div style="font-size:80%">' + data + '</div>';
					}
					else{ 
						pblock.innerHTML  += "<br/>No result Found"; 
					}
					if($(xml).find("td.sbody").size() > 0){ //suggestion list
						pblock.innerHTML += "<br/>Other suggestions available: <br/>";
						data = "";
						$(xml).find("td.sbody").each(function(){
							data += "<div style='margin-left:1em'>" + this.innerHTML.replace(/<br(\/)?>/g,'')  + "</div>";
						});
						pblock.innerHTML += "<div style='font-size:80%'>" + data + "</div>";
					}
				});
			});
		}
	}
});
