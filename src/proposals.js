function createProposal(planitId, taskId) {
  $.ajax({
    url: '/planits/' + planitId + '/tasks/' + taskId,
    method: 'get'
  }).done(function(details){
    console.log(taskId)
    appvars.task = details.tasks[0]
    var data = {
      task: appvars.task,
      title: 'Proposal Creation',
      planitId: planitId
    };
    displayTemplate('main', 'proposalupdate', data);
  })
}

function createProposalPost(event, planitId, taskId) {
  if (event) event.preventDefault();
  var formData = getFormData('form');
  $.ajax({
    url: '/planits/' + planitId + '/tasks/' + taskId + '/proposals/',
    method: 'post',
    data: formData,
    xhrFields: {
      withCredentials: true
    }
  }).done(function(data) {
    viewTask(planitId, taskId);
  }).fail(function(err){
    customAlert('All fields must be filled out to create a proposal')
  });
}

function listProposals() {
  $.ajax({
    url: '/proposals',
    method: 'get'
  }).done(function(proposals) {
    Proposals.user = appvars.user;
    displayTemplate('main', 'proposals', proposals);
  });
}

function viewProposal(planitId, taskId, id) {
  $.ajax({
    url: '/proposals/' + id,
    method: 'get'
  }).then(function(proposals) {
    return Promise.all([
      $.ajax({
        url: '/members/' + proposals.proposals[0].member_id,
        method: 'get'
      }),
      $.ajax({
        url: '/planits/' + planitId,
        method: 'get'
      })
    ]).then(function(data) {
      return Promise.resolve({
        member: data[0].members[0],
        skills: data[0].skills,
        proposal: proposals.proposals[0],
        planit: data[1].planits[0]
      });
    });
  }).then(function(serverData) {
    data = {
      proposal: serverData.proposal,
      member: serverData.member,
      skills: serverData.skills,
      planit: serverData.planit,
      taskId: taskId,
      user: appvars.user,
      respondable: appvars.user && (appvars.user.id == serverData.planit.member_id || appvars.user.role_name == 'admin'),
      editable: appvars.user && (appvars.user.id == serverData.proposal.member_id || appvars.user.role_name == 'admin'),
      deletable: appvars.user && (appvars.user.id == serverData.proposal.member_id || appvars.user.role_name !== 'normal')
    };
    displayTemplate('main', 'proposal', data);
  });
}

function updateProposal(planitId, taskId, id) {
  Promise.all([
  $.ajax({
    url: '/planits/' + planitId + '/tasks/' + taskId + '/proposals/' + id,
    method: 'get'
  })
  ]).then(function(serverData) {
    appvars.proposal = serverData[0].proposals[0];
    var proposal = serverData[0].proposals[0];
    var data = {
      planitId: planitId,
      taskId: taskId,
      title: 'Proposal Update',
      proposal: appvars.proposal,
      update: true,
    };
    displayTemplate('main', 'proposalupdate', data);
  });
}

function updateProposalPut(event, planitId, taskId, id) {
  if (event) event.preventDefault();
  var formData = getFormData('form');
  $.ajax({
    url: '/planits/' + planitId + '/tasks/' + taskId + '/proposals/' + id,
    method: 'put',
    data: formData,
    xhrFields: {
      withCredentials: true
    }
  }).done(function(data) {
    viewProposal(planitId, taskId, id);
  });
}

function deleteProposal(planitId, taskId, id) {
  customConfirm('Are you sure you want to delete this proposal?', function() {
    $.ajax({
      url: '/planits/' + planitId + '/tasks/' + taskId + '/proposals/' + id,
      method: 'delete',
      xhrFields: {
        withCredentials: true
      }
    }).done(function(data) {
      if (id == appvars.user.id) {
        logout();
      } else {
        viewTask(planitId, taskId);
      }
    });
  });
}

function setProposalStatus(id, status){
  $.ajax({
    url: '/proposals/' + id + status ? '/accept' : '/reject',
    method: 'put',
    xhrFields: {
      withCredentials: true
    }
  }).done(function(data) {
    viewProposal(data.planitId, data.taskId, id);
  }).fail(customAlert);
}
