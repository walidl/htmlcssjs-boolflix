
function printFilms(data,voto){

  var fList = $(".filmList")
  var template = $("#film-template").html();
  var comp = Handlebars.compile(template);
  var film = comp(data);
  var item = $(film);

  var stars = item.children("li.stars").children(".fa-star");

  for (var i = 0; i < voto; i++) {
    stars.eq(i).addClass("accesa");
  }

  item.appendTo(fList);

}

function getFlag(lang){

  switch (lang) {
    case "en":
      return "img/Great Britain.svg";

    case "ja":
      return "img/Japan.svg";

    case "it":
      return "img/Italy.svg";

    case "zh":
      return "img/China.svg";

    default:
    return "";
  }
}

function getResults(list){

  for (var i = 0; i < list.length; i++) {

    var item = list[i];
    var voto = Math.ceil(item.vote_average/2);

    var dati = {

      titolo: item.title,
      ogTitolo: item.original_title,
      rating: voto
      // lingua: item.original_language,
    }

    var flagUrl = getFlag(item.original_language)

    if( flagUrl != ""){

      dati.lingua = "";
      dati.flag = flagUrl;
    }

    else{
      dati.lingua = item.original_language;
      dati.flag = "";
    }

    printFilms(dati,voto);
  }
}

function genPages(pageNum){

  var pages = $(".pages");

  console.log(pageNum);
  for (var i = 1; i <= pageNum; i++) {

    var dati = {
      number: i,
    }

    var template = $("#pages-template").html();
    var comp = Handlebars.compile(template);
    var pNum = comp(dati);

    pages.append(pNum);
  }
  pages.children(".page-num").eq(0).addClass("current")
}

function apiCall(search,page){

 var outData = {

   api_key: "be7a5b068bb701d40ef499c039960c53",
   language: "it-IT",
   query: search,
   page: page,
  }

  $.ajax({

    url: "https://api.themoviedb.org/3/search/movie",
    data: outData,
    method: "GET",
    success: function(inData, stato){

      if(page == "" ){genPages(inData.total_pages);}
      getResults(inData.results);

    },
    error: function(request, stato ,error){

      console.log("error");
    }
  })
}

function clickPage(){

  var pages = $(".pages");

  pages.on("click",".page-num",function(){

    var pag = parseInt($(this).text(),10);

    $(".filmList").empty()
    apiCall( $("#search-input").val(), pag);

    pages.children().removeClass("current");
    $(this).addClass("current");
  })

}

function getVal(elem){

  $(".filmList").empty();
  $(".pages").empty();
  apiCall(elem.val(),"")
}

function init(){

  var srcImp = $("#search-input");
  var srcBtn = $("#search-button");

  srcImp.keyup(function(e){

    if(e.keyCode == 13 ){getVal(srcImp);}
  });

  srcBtn.click(function(){

    getVal(srcImp);
  })

  clickPage();
}

$(document).ready(init)
