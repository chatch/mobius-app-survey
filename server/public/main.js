// localStorage keys
const TOKEN_KEY = 'token'
const USER_KEY = 'userid'

// server .env for these values:
const FEE_NEW_SURVEY = 10
const REWARD_COMPLETE_SURVEY = 1

/*******    Utilities     *******/

function getUrlVars() {
  var vars = [],
    hash
  var hashes = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&')
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=')
    vars.push(hash[0])
    vars[hash[0]] = hash[1]
  }
  return vars
}

function getParams() {
  var url = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&')
  var result = {}
  url.forEach(function(item) {
    var param = item.split('=')
    result[param[0]] = param[1]
  })
  return result
}

function setHeaders(xhr) {
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`)
}

function setHeadersJSON(xhr) {
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`)
}

function serverUri(path) {
  return `/${path ? path : ''}`
}

function clientUri(path) {
  return `/${path ? path : ''}?token=${getToken()}`
}

/*******    DApp Store     *******/

let intervalIDLoadBalance = null

// check for the JWT token assigned by the Mobius Dapp Store auth flow
// (auth flow gets a token from our /auth endpoint)
function checkToken() {
  const jwtToken = getUrlVars()[TOKEN_KEY]
  if (!jwtToken) {
    window.location.href = '/401.html'
  } else {
    storeToken(jwtToken)
    loadUser()
    // clearInterval(intervalIDLoadBalance)
    if (intervalIDLoadBalance == null) {
      loadBalances()
      intervalIDLoadBalance = setInterval(loadBalances, 15000)
    }
  }
}

function storeToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function loadUser() {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', serverUri('test'), true)
  setHeaders(xhr)
  xhr.onload = function() {
    var result = xhr.response ? JSON.parse(xhr.response) : null
    if (xhr.status === 200) {
      storeUser(result.user.sub)
    }
  }
  xhr.send()
}

function storeUser(user) {
  localStorage.setItem(USER_KEY, user)
}

function getUser() {
  return localStorage.getItem(USER_KEY)
}

function loadUserBalance() {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', serverUri('balance'), true)
  setHeaders(xhr)
  xhr.onload = function() {
    var result = xhr.response ? JSON.parse(xhr.response) : null
    if (xhr.status === 200) {
      $('#mobi-user-balance').text(result.balance)
    }
  }
  xhr.send()
}

function loadAppBalance() {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', serverUri('appBalance'), true)
  setHeaders(xhr)
  xhr.onload = function() {
    var result = xhr.response ? JSON.parse(xhr.response) : null
    if (xhr.status === 200) {
      $('#mobi-app-balance').text(result.balance)
    }
  }
  xhr.send()
}

function loadBalances() {
  loadUserBalance()
  loadAppBalance()
}

/*******    Survey Editor     *******/

var surveyName = ''
function setSurveyName(name) {
  var $titleTitle = jQuery('#sjs_editor_title_show')
  $titleTitle.find('span:first-child').text(name)
}
function startEdit() {
  var $titleEditor = jQuery('#sjs_editor_title_edit')
  var $titleTitle = jQuery('#sjs_editor_title_show')
  $titleTitle.hide()
  $titleEditor.show()
  $titleEditor.find('input')[0].value = surveyName
  $titleEditor.find('input').focus()
}
function cancelEdit() {
  var $titleEditor = jQuery('#sjs_editor_title_edit')
  var $titleTitle = jQuery('#sjs_editor_title_show')
  $titleEditor.hide()
  $titleTitle.show()
}
function postEdit() {
  cancelEdit()
  var oldName = surveyName
  var $titleEditor = jQuery('#sjs_editor_title_edit')
  surveyName = $titleEditor.find('input')[0].value
  setSurveyName(surveyName)

  const surveyId = decodeURI(getParams()['id'])

  var xhr = new XMLHttpRequest()
  xhr.open('PUT', serverUri('changeName'))
  setHeadersJSON(xhr)
  xhr.onload = function() {
    var result = xhr.response ? JSON.parse(xhr.response) : null
    if (xhr.status !== 200) {
      surveyName = oldName
      setSurveyName(surveyName)
      alert(JSON.stringify(error))
    }
  }
  xhr.send(JSON.stringify({id: surveyId, name: surveyName}))
}

function initSurveyEditor() {
  checkToken()

  // set to blank which will default to the window.location
  // if not overridden the surveyjs backend service will be used
  Survey.dxSurveyService.serviceUrl = ''

  const editorOptions = {
    questionTypes: ['text', 'checkbox', 'radiogroup', 'dropdown'],
  }
  const editor = new SurveyEditor.SurveyEditor('editor', editorOptions)

  const surveyId = decodeURI(getParams()['id'])
  const surveyName = decodeURI(getParams()['name'])

  editor.loadSurvey(surveyId)

  editor.saveSurveyFunc = function(saveNo, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('PUT', serverUri('changeJson'))
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`)
    xhr.onload = function() {
      var result = xhr.response ? JSON.parse(xhr.response) : null
      if (xhr.status === 200) {
        callback(saveNo, true)
      }
    }
    xhr.send(
      JSON.stringify({Id: surveyId, Json: editor.text, Text: editor.text})
    )
  }

  editor.isAutoSave = true
  editor.showState = true
  editor.showOptions = true

  setSurveyName(surveyName)
}

/*******    Survey List     *******/

function SurveyListManager() {
  const self = this
  self.availableSurveys = ko.observableArray()

  self.loadSurveys = function() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', serverUri('getActive'))
    setHeaders(xhr)
    xhr.onload = function() {
      const result = xhr.response ? JSON.parse(xhr.response) : {}
      self.availableSurveys(
        Object.keys(result).map(function(key) {
          return {
            id: key,
            name: result[key].name || key,
            survey: result[key].json || result[key],
          }
        })
      )
    }
    xhr.send()
  }

  self.createSurvey = function(name, onCreate) {
    const xhr = new XMLHttpRequest()
    const completions = $('#survey-completions').val()
    xhr.open(
      'GET',
      serverUri('create') + `?name=${name}&completions=${completions}`
    )
    setHeaders(xhr)
    xhr.onload = function() {
      $('#add-button').button('reset')
      const result = xhr.response ? JSON.parse(xhr.response) : null
      !!onCreate && onCreate(xhr.status == 200, result, xhr.response)
    }
    $('#add-button').button('loading')
    $('#Searching_Modal').modal('show')
    xhr.send()
  }

  self.deleteSurvey = function(id, onDelete) {
    if (confirm('Are you sure?')) {
      const xhr = new XMLHttpRequest()
      xhr.open('DELETE', serverUri('delete') + '?id=' + id)
      setHeaders(xhr)
      xhr.onload = function() {
        const result = xhr.response ? JSON.parse(xhr.response) : null
        !!onDelete && onDelete(xhr.status == 200, result, xhr.response)
      }
      xhr.send()
    }
  }

  self.loadSurveys()
}

function initSurveyList() {
  checkToken()

  const calcFee = () => {
    const count = $('#survey-completions').val()
    if (Number.isInteger(Number(count)) && count > 0) {
      const totalFee = FEE_NEW_SURVEY + count * REWARD_COMPLETE_SURVEY
      $('#total-cost').text(totalFee)
    } else {
      console.error(`completions value is not a positive number`)
    }
  }

  calcFee()

  $('#survey-completions').keyup(calcFee)
  $('#survey-completions').change(calcFee)

  ko.applyBindings(
    new SurveyListManager(''),
    document.getElementById('surveys-list')
  )
}

/*******    Survey Results     *******/

function SurveyResultsManager() {
  var self = this
  self.surveyId = decodeURI(getParams()['id'])
  self.results = ko.observableArray()
  Survey.dxSurveyService.serviceUrl = ''
  var survey = new Survey.Model({
    surveyId: self.surveyId,
    surveyPostId: self.surveyId,
  })
  self.columns = ko.observableArray()

  self.loadResults = function() {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', serverUri('results') + '?postId=' + self.surveyId)
    setHeaders(xhr)
    xhr.onload = function() {
      var result = xhr.response ? JSON.parse(xhr.response) : []
      self.results(
        result.map(function(r) {
          return JSON.parse(r || '{}')
        })
      )
      self.columns(
        survey.getAllQuestions().map(function(q) {
          return {
            data: q.name,
            sTitle: (q.title || '').trim(' ') || q.name,
            mRender: function(data, type, row) {
              survey.data = row
              var displayValue = q.displayValue
              return (
                (typeof displayValue === 'string'
                  ? displayValue
                  : JSON.stringify(displayValue)) || ''
              )
            },
          }
        })
      )
      self.columns.push({
        targets: -1,
        data: null,
        sortable: false,
        defaultContent:
          "<button style='min-width: 150px;'>Show in Survey</button>",
      })
      var table = $('#resultsTable').DataTable({
        columns: self.columns(),
        data: self.results(),
      })

      var json = new Survey.JsonObject().toJsonObject(survey)
      var windowSurvey = new Survey.SurveyWindow(json)
      windowSurvey.survey.mode = 'display'
      windowSurvey.survey.title = self.surveyId
      windowSurvey.show()

      $(document).on('click', '#resultsTable td', function(e) {
        var row_object = table.row(this).data()
        windowSurvey.survey.data = row_object
        windowSurvey.isExpanded = true
      })
    }
    xhr.send()
  }

  survey.onLoadSurveyFromService = function() {
    self.loadResults()
  }
}

function initSurveyResults() {
  checkToken()
  ko.applyBindings(new SurveyResultsManager(''), document.body)
}

/*******    Survey View     *******/

function initSurveyView() {
  checkToken()

  Survey.dxSurveyService.serviceUrl = ''

  var css = {
    root: 'sv_main sv_frame sv_default_css',
  }

  var surveyId = decodeURI(getParams()['id'])
  var model = new Survey.Model({surveyId: surveyId}) //, surveyPostId: surveyId})
  model.css = css
  model.onComplete.add(function(sender, options) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', '/post')
    setHeadersJSON(xhr)
    xhr.onload = xhr.onerror = function() {
      if (xhr.status == 200) {
        options.showDataSavingSuccess() //you may pass a text parameter to show your own text
        //Or you may clear all messages
        //options.showDataSavingClear();
      } else {
        //Error
        options.showDataSavingError() //you may pass a text parameter to show your own text
      }
    }
    xhr.send(JSON.stringify({postId: surveyId, surveyResult: sender.data}))
  })
  window.survey = model
  model.render('surveyElement')
}
