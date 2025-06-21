// получаем HTML DOM
const textarea = document.getElementById('chatInput');
const submit = document.getElementById('submit');
const chatBody = document.getElementById('chat'); 
const addTest = document.getElementById('add-test');
const testList = document.getElementById('test-list');
const addTab = document.getElementById('add-tab');
const sideBar = document.getElementById('sidebar');
const exportButton = document.getElementById('export');
const newTabName = document.getElementById('tab-name');
const deleteTab = document.getElementById('delete-tab');
const inputCategory = document.getElementById('category');
const nameOfFile = document.getElementById('nameOfFile');
const downloadXmlFile = document.getElementById('download-moodle-xml');
var rotated = false;
var tabsStorage = {

};
var nextId = 0;

// функция, которая листает в низ дива
function scrollToBottom(div) {
  let height = div.scrollHeight;
  //console.log(height);
  chatBody.scrollIntoView(false);
  //div.scrollTop = height;
  //div.scrollTop.behavior = 'smooth';
};

//позволяет делать спуск в поле текста на shift+enter
function textareaInput(event) 
{
  let value = event.which;

  if (value == 13 && !event.shiftKey){
    event.preventDefault();
    manageChat();
  };
}

function inputTabName(event) 
{
  let value = event.which;

  if (value == 13 && !event.shiftKey){
    event.preventDefault();
    $('#tab-change-name').click();
  };
}

// Создание стартового сообщения
var startMessage = document.createElement(`div`);
startMessage.classList.add('chat', 'chat-bot');

var startSpan = document.createElement(`span`);
startSpan.textContent = 'Здравствуйте! Что нужно решить для вас сегодня?';

startMessage.appendChild(startSpan);

tabsStorage[nextId] = {
  messages : [startMessage],
  tests : []
};

nextId += 1;

// функция, создающая пустую вкладку
function createTab(label = "Новая вкладка") {
  var tabEl = document.createElement(`div`);
  tabEl.id = nextId;
  nextId += 1;
  tabEl.classList.add(`d-flex`, `sidebar-pair`);

  tabEl.innerHTML = `<button type="button" class="btn sidebar-button" data-toggle="button" aria-pressed="true"><span>${label}</span></button>`;

  // добавление нового id в tabsStorage
  tabsStorage[tabEl.id] = {
    messages: [startMessage],
    tests : []
  }

  // моё contextmenu с функцией удаление вкладки
  tabEl.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    // гарантия наличия лишь одной выбранной вкладки для работы с contextmenu
    $('.sidebar-pair').removeClass('selected-tab');

    let e = window.event;
    let windowWidth = window.innerWidth;

    //граматное появление contextmenu относительно свободного места экрана
    if (windowWidth - e.clientX < 134) {
      var x = e.clientX - 134;
    }
    else {
      var x = e.clientX + 6;
    }

    if (windowWidth - e.clientY < 36*2) {
      var y = e.clientY - 40;
    }
    else {
      var y = e.clientY;
    }

    document.getElementById('contextmenu-tabs').className = "shown contextmenu";
    document.getElementById('contextmenu-tabs').style.top = y + 'px';
    document.getElementById('contextmenu-tabs').style.left = x + 'px';

    tabEl.classList.add('selected-tab');
  });

  // выделяет активную вкладку и прогружает хранящиеся сообщения и тесты
  tabEl.addEventListener("click", function(event) {
    $('.sidebar-pair').removeClass('active-tab');
    var tabsId = tabEl.id;

    tabEl.classList.add('active-tab');
    let storedInfo = tabsStorage[tabsId];
    
    chatBody.innerHTML = '';
    testList.innerHTML = '';

    // вывод сообщений и тестов
    if (storedInfo.tests.length > 0) {
      for (let i = 0; i <= storedInfo.tests.length - 1; i++) {
        testList.appendChild(storedInfo.tests[i]);
      };
    };

    if (storedInfo.messages.length > 0) {
      for (let i = 0; i <= storedInfo.messages.length - 1; i++) {
        chatBody.appendChild(storedInfo.messages[i]);
      };
    };
    
    testList.appendChild(addTest);
  });

  sideBar.insertBefore(tabEl, addTab);
}

// смена названия вкладки
$('#tab-change-name').click(function(event) {
  let tabToChangeName = document.getElementsByClassName('selected-tab')[0];

  tabToChangeName.firstChild.firstChild.textContent = newTabName.value;
});

$("#delete-tab").click(function(event) {
  let tab = document.getElementsByClassName('selected-tab')[0];
  let tabList = tab.classList;

  // запрет на удаление единственной вкладки
  if (sideBar.children.length != 2) {
    sideBar.removeChild(tab);
    delete tabsStorage[tab.id];
  } else {
    console.log("Нельзя удалить единственную вкладку");
    $('.sidebar-pair').removeClass('selected-tab');
  }

  // выбор новой выбранной вкладки, если удаляемая была выбранной
  let check = false;
  for (let i = 0; i < tabList.length - 1; i++) {
    if (tabList[i] == "active-tab") {
      check = true;
    }
  }
  if (check) {
    document.getElementsByClassName("sidebar-pair")[0].click();
  }
  // if (tab.classList.includes('active-tab')) {
  //   document.getElementsByClassName("sidebar-pair")[0].classList.add('selected-tab');
  // }

  document.getElementById('contextmenu-tabs').className = 'hidden contextmenu';
});

//оформление полученного сообщения message в html документе
function messageEl (message, className) {
    var chatEl = document.createElement(`div`);
    chatEl.classList.add(`chat`, `${className}`);
    let chatContent;    
  
    if (className == "user") {
      chatContent = `<p>${message}</p>`;
    }

    if (className == "chat-bot") {
      chatContent = `<div class="code-solvation"><pre><code class="hljs python-html">${message}</code></pre></div>`;

      chatEl.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        let e = window.event;
        let windowWidth = window.innerWidth;

        //граматное появление contextmenu относительно свободного места экрана
        if (windowWidth - e.clientX < 134) {
          var x = e.clientX - 134;
        }
        else {
          var x = e.clientX + 6;
        }

        if (windowWidth - e.clientY < 36*2) {
          var y = e.clientY - 40;
        }
        else {
          var y = e.clientY;
        }

        document.getElementById('contextmenu-selected-solution').className = "shown contextmenu";
        document.getElementById('contextmenu-selected-solution').style.top = y + 'px';
        document.getElementById('contextmenu-selected-solution').style.left = x + 'px';

        $("#select-solution").click(function() {
          $('.chat-bot').removeClass('selected-solution');

          chatEl.classList.add('selected-solution');
        });

      });
    }

    chatEl.innerHTML = chatContent;
      return chatEl;
}

//возможность нажатия на кнопки на contextmenu при помощи пкм
document.getElementById("detele-test").addEventListener('contextmenu', function(e) {
  e.preventDefault();
  $("#detele-test").click();
})

document.getElementById("select-solution").addEventListener('contextmenu', function(e) {
  e.preventDefault();
  $("#select-solution").click();
})

//отправление сообщения и получение решения с сервера
function manageChat() {
  var userMessage = textarea.value.trim();

  if (!userMessage) return;

  textarea.value = "";

  var tabsId = document.getElementsByClassName('active-tab')[0].id;
  var storedInfo = tabsStorage[tabsId];
  
  //console.log(chatBody.scrollHeight);

  // сохранение отправленного сообщения пользователя в tabsStorage к текущей открытой вкладке
  if (storedInfo) {
    let userMessageHtml = messageEl(userMessage, "user");
    chatBody.appendChild(userMessageHtml);

    storedInfo.messages.push(userMessageHtml);
    tabsStorage[tabsId] = storedInfo;
    }

  var countOfMessages = document.getElementsByClassName('chat chat-bot').length;

  var botMessage = messageEl("...", "chat-bot");
  botMessage.style = "animation: appearing 0.3s linear";
  chatBody.appendChild(botMessage);
  setTimeout(() => {
    botMessage.style = ""
    tabsStorage[tabsId].messages.push(botMessage)
  }, 1000);

  var idOfBotMessage = chatBody.children.length - 1;

  $.ajax({
    type: "POST",
    contentType: "application/json; charset=utf-8",
    url: "https://olegpepeg.ru/api/chat",
    data: JSON.stringify({
      "messages" : [
        {
          "role" : "user", 
          "content" : `${userMessage}`
        }
      ]
    }),
    success: function (data) {
      var solution = data.solution;
      var botMessageNew = messageEl(solution, "chat-bot");

      // сохранение полученного сообщения в tabStorage к текущей открытой вкладке
      var storedInfo = tabsStorage[tabsId];

      if (countOfMessages == 1) {
        botMessageNew.classList.add('selected-solution');
      };

      if (storedInfo) {
        tabsStorage[tabsId].messages[idOfBotMessage] = botMessageNew;
        if (document.getElementsByClassName('active-tab')[0].id == tabsId) {
          chatBody.replaceChild(botMessageNew, botMessage);
        };
      };

      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "https://olegpepeg.ru/api/create_tests",
        data: JSON.stringify({
          "problem": `${userMessage}`
        }),
        success: function (data) {
          for (let i = 0; i < data.tests.length; i++) {
            // сохранение полученного сообщения в tabStorage к текущей открытой вкладке
            let storedInfo = tabsStorage[tabsId];

            if (storedInfo) {
              let test = createTest(input = data.tests[i].input, output = data.tests[i].expected, solution = solution);
              tabsStorage[tabsId].tests.push(test);
              if (document.getElementsByClassName('active-tab')[0].id == tabsId) { 
                testList.insertBefore(test, addTest);
              }
            }
          }
        }
      });
    }
  });
}

// выключение открытие встроенного contextmenu 
document.getElementById('sidebar').addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

document.getElementById('tests').addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

document.getElementById('chat').addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// функция, создающая пустой тест
function createTest(input = '', output = '') {
  var testEl = document.createElement(`div`);
  testEl.classList.add(`test-box`, `d-flex`);

  var result = document.createElement('div');
  result.classList.add('test-result', 'roboto');

  //проверка тестов на сервере
  result.addEventListener("click", function get_result(event) {
    var solution;
    let input = event.target.parentNode.children[0].value;
    let output = event.target.parentNode.children[1].value;
    result.innerHTML = `<div class = "loader"></div>`;

    if (document.getElementsByClassName('selected-solution').length != 0) {
      var solution = document.getElementsByClassName('selected-solution')[0].firstChild.firstChild.firstChild.textContent;
    }

    if (input == '' || output == '' || solution == '') {
      console.log('input/output/solution is empty!');
      result.innerHTML = "!";
      console.log(input, output, solution);
      return
    }

    test(solution, input, output).then(
      function (data) {
        // console.log(`result: ${JSON.stringify(data)}`)
        if (data.status == "Passed") {
          result.innerHTML = `<span>+</span>`;
          result.classList.add(`passed`);
        }
        else if (data.status == "Failed") {
          result.innerHTML = `<span>-</span>`;
          result.classList.add('failed');
        }
        else {
          result.innerHTML = `<span>!</span>`;
          result.classList.add('error');
          // console.log(data.message);
          // console.log(solution);
        }
      }
    )
  }
  );
  
  innerHtml = `<input type="text" class="input form-control roboto d-flex" placeholder="input" value="${input}" /><input type="text" class="output form-control roboto d-flex" placeholder="output" value="${output}" />`;
  testEl.innerHTML = innerHtml;

  // удаление вкладки при нажатии на Delete
  testEl.addEventListener("keydown", function(event){
      if (event.key == "Delete") {
        testEl.remove();
      };
  });

  testEl.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    let e = window.event;
    let windowWidth = window.innerWidth;

    testEl.classList.add('selected-test-box');

    //граматное появление contextmenu относительно свободного места экрана
    if (windowWidth - e.clientX < 134) {
      var x = e.clientX - 134;
    }
    else {
      var x = e.clientX;
    }

    if (windowWidth - e.clientY < (36*2 + 12)) {
      var y = e.clientY - (36*2 + 20);
    }
    else {
      var y = e.clientY;
    }

    document.getElementById('contextmenu').className = "shown contextmenu";
    document.getElementById('contextmenu').style.top = y + 'px';
    document.getElementById('contextmenu').style.left = x + 'px';
  });

  testEl.appendChild(result);
  return testEl;
}

// анимация стрелочки у кнопки export
exportButton.addEventListener("click", function(event) {
  let arrowUp = document.getElementById('arrowUp');  
  let deg = rotated? 0 : 180;

  arrowUp.style.mozTransform    = 'rotate('+deg+'deg)'; 
  arrowUp.style.msTransform     = 'rotate('+deg+'deg)'; 
  arrowUp.style.oTransform      = 'rotate('+deg+'deg)'; 
  arrowUp.style.transform       = 'rotate('+deg+'deg)';

  rotated = !rotated;
});

// скачивание решения в формате moodle xml
downloadXmlFile.addEventListener('click', function(event) {
  download();
});

// скачивание тестов и задания в формате moodle xml с плагином coderunner
function download() {
  var selectedQuestion = document.getElementsByClassName('chat user')[0].firstChild.textContent;
  var amountOfTests = document.getElementsByClassName('test-box').length;
  var selectedSolution = document.getElementsByClassName('selected-solution')[0].firstChild.firstChild.firstChild.textContent;

  if (nameOfFile.value != '') {
    var filename = nameOfFile.value;
  } else {
    var filename = 'question.xml';
  }
  if (inputCategory.value != '') {
    var nameOfQuestion = inputCategory.value;
  } else {
    var nameOfQuestion = 'Название задания';
  }

  var xml = `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
  <question type="coderunner">
    <name>
      <text>${nameOfQuestion}</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[<p>${selectedQuestion}</p>]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text></text>
    </generalfeedback>
    <defaultgrade>1</defaultgrade>
    <penalty>0</penalty>
    <hidden>0</hidden>
    <idnumber></idnumber>
    <coderunnertype>python3</coderunnertype>
    <prototypetype>0</prototypetype>
    <allornothing>1</allornothing>
    <penaltyregime>10, 20, ...</penaltyregime>
    <precheck>4</precheck>
    <hidecheck>0</hidecheck>
    <showsource>0</showsource>
    <answerboxlines>18</answerboxlines>
    <answerboxcolumns>100</answerboxcolumns>
    <answerpreload></answerpreload>
    <globalextra></globalextra>
    <useace></useace>
    <resultcolumns></resultcolumns>
    <template></template>
    <iscombinatortemplate></iscombinatortemplate>
    <allowmultiplestdins></allowmultiplestdins>
    <answer><![CDATA[${selectedSolution}]]></answer>
    <validateonsave>1</validateonsave>
    <testsplitterre></testsplitterre>
    <language></language>
    <acelang></acelang>
    <sandbox></sandbox>
    <grader></grader>
    <cputimelimitsecs></cputimelimitsecs>
    <memlimitmb></memlimitmb>
    <sandboxparams></sandboxparams>
    <templateparams></templateparams>
    <hoisttemplateparams>1</hoisttemplateparams>
    <extractcodefromjson>1</extractcodefromjson>
    <templateparamslang>None</templateparamslang>
    <templateparamsevalpertry>0</templateparamsevalpertry>
    <templateparamsevald></templateparamsevald>
    <twigall>0</twigall>
    <uiplugin></uiplugin>
    <uiparameters></uiparameters>
    <attachments>0</attachments>
    <attachmentsrequired>0</attachmentsrequired>
    <maxfilesize>10240</maxfilesize>
    <filenamesregex></filenamesregex>
    <filenamesexplain></filenamesexplain>
    <displayfeedback>2</displayfeedback>
    <giveupallowed>0</giveupallowed>
    <prototypeextra></prototypeextra>
    <testcases>`;

  // добавление всех вопросов
  for (let i = 0; i < amountOfTests; i++) {
    let test = document.getElementsByClassName('test-box')[i];
    xml += `
      <testcase testtype="0" useasexample="0" hiderestiffail="1" mark="1.0000000" >
        <stdin>
                  <text>${test.children[0].value}</text>
        </stdin>
        <expected>
                  <text>${test.children[1].value}</text>
        </expected>
        <extra>
                  <text></text>
        </extra>
        <display>
                  <text>HIDE</text>
        </display>
      </testcase>`;
  };

  xml += `
    </testcases>
  </question>
</quiz>`;

  var blob = new Blob([xml], {type: 'application/xml'});
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');

  link.setAttribute('download', filename);
  link.href = url;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// скрипт будет запущен тогда, когда прогрузится HTML страница с стилями 
$(document).ready(function(){
  // создание начальной вкладки
  createTab();
  let startTab = document.getElementsByClassName('sidebar-pair')[0];
  startTab.click();

  $('#submit').click(function () {
    manageChat();
  });
  
  $('#add-test').click(function() {
    let tabsId = document.getElementsByClassName('active-tab')[0].id;
    let storedInfo = tabsStorage[tabsId];

    if (storedInfo) {
      let test = createTest();
      tabsStorage[tabsId].tests.push(test);
      testList.insertBefore(test, addTest);
    }
  });
  
  $('#add-tab').click(function() {
    createTab();
  });
  
  $(document).bind("click", function(event) {
    $('.selected-test-box').removeClass('selected-test-box');
    document.getElementById('contextmenu').className = 'hidden contextmenu';
    document.getElementById('contextmenu-selected-solution').className = 'hidden contextmenu';

    if ((!document.getElementById('contextmenu-tabs').contains(event.target)) || (document.getElementById('tab-change-name').contains(event.target))) {
      document.getElementById('contextmenu-tabs').className = 'hidden contextmenu';
      $('.sidebar-pair').removeClass('selected-tab');
      newTabName.value = '';
    }
  });

  $('#detele-test').click(function() {
    $('.selected-test-box').remove();
  });
});