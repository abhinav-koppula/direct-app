/**
 * The JavaScript code used by the Launch Copilot Posting Contest views.
 *
 * @author TCSDEVELOPER
 * @version 1.0 (Direct Copilot Posting Contest Launching assembly)
 */

var currentDocument = {};
var documents = [];
var documents2 = [];
var projectId = -1;

$(document).ready(function() {

    initDialog('errorDialog', 500);

    var SelectOptions = {
        ddMaxHeight: '200px',
        yscroll: true
    };

    $('#projects2, #billingProjects2').sSelect(SelectOptions);
    
    $('#start2TimeInput').getSetSSValue(getTimePart($('#mainContent').data('p3')));
    

    /* init date-pack */
    if ($('.date-pick').length > 0) {
        $(".date-pick").datePicker().val(new Date().asString()).trigger('change');
    }

    tinyMCE.init({
        mode : "exact",
        elements : "publicCopilotPostingDescription2, privateCopilotPostingDescription2",
        plugins : "paste",
        theme : "advanced",
        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,undo,redo,pasteword, bullist,numlist,link,unlink",
        theme_advanced_buttons2 : "",
        theme_advanced_buttons3 : "",
        init_instance_callback : function() {
            $('table.mceLayout').css('width', '100%');
        }
    });

    /* init pop */
    var prevPopup = null;
    showPopup = function(myLink, myPopupId) {
        var myLinkLeft = myLinkTop = 0;

        /* hide the previous popup */
        if (prevPopup) {
            $(prevPopup).css("display", "none");
        }

        prevPopup = $('#' + myPopupId);

        /* get the position of the current link */
        do{
            myLinkLeft += myLink.offsetLeft;
            myLinkTop += myLink.offsetTop;
        } while (myLink = myLink.offsetParent);

        /* set the position of the popup */
        var popUpHeight2 = $('#' + myPopupId).height() / 2;

        myLinkTop -= popUpHeight2;

        $('#' + myPopupId).css("top", (myLinkTop + 4) + 'px');
        $('#' + myPopupId).css("left", ( myLinkLeft + 22 ) + 'px');

        /* set the positio of the arrow inside the popup */
        $(".tooltipContainer SPAN.arrow").css("top", popUpHeight2 + 'px');

        /* show the popup */
        $('#' + myPopupId).css("display", "block");
    };

    $('#CopilotPostingPublicDescHelpIcon').hover(function() {
        showPopup(this, 'copilotPostingPublicDescriptionToolTip');
    }, function() {
        $('#copilotPostingPublicDescriptionToolTip').hide();
    });

    $('#CopilotPostingPrivateDescHelpIcon').hover(function() {
        showPopup(this, 'copilotPostingPrivateDescriptionToolTip');
    }, function() {
        $('#copilotPostingPrivateDescriptionToolTip').hide();
    });

    $('#CopilotPostingCostsHelpIcon').hover(function() {
        showPopup(this, 'copilotPostingCostsToolTip');
    }, function() {
        $('#copilotPostingCostsToolTip').hide();
    });

    // styling file input
    $(".fileUpload .fileInput").styleingInputFile();

    // edit function
    $(".editMask .editPanel").hide();
    $(".editMask .editLink").click(function() {
        var mask = $(this).parents(".editMask");
        mask.find(".editPanel").show();
        mask.find(".infoPanel").hide();
    });

    $('#cancelContestInfo').click(function() {
        hideEdit($(this));
        
        $('#contestNameInput2').val($('#contestNameTextLabel').html());
        $('#projects2').getSetSSValue($('#mainContent').data('p1'));
        $('#billingProjects2').getSetSSValue($('#mainContent').data('p2'));
        
        return false;
    });

    $('#saveContestInfo').click(function() {
        var errors = [];

        if ($('#projects2').val() == '-1') {
            errors.push('Project is not selected');
        }
        if (!checkRequired($('#contestNameInput2').val())) {
            errors.push('Contest name is empty');
        }
        if ($('#billingProjects2').val() == '0') {
            errors.push('Billing account is not selected');
        }

        if (errors.length > 0) {
            showErrors(errors);
        } else {
            hideEdit($(this));
            updateProjectGeneralInfo();
        }

        return false;
    });

    $('#cancelDates').click(function() {
        hideEdit($(this));
        $('#start2DateInput').val(getDatePart($('#mainContent').data('p3')));
        $('#start2TimeInput').getSetSSValue(getTimePart($('#mainContent').data('p3')));
        return false;
    });

    $('#saveDates').click(function() {
        var errors = [];

        var startDate = getDateByIdPrefix('start2');

        if (errors.length > 0) {
            showErrors(errors);
        } else {
            hideEdit($(this));
            updateProjectDate();
        }
        return false;
    });

    $('#cancelPublicDesc').click(function() {
        hideEdit($(this));
        tinyMCE.get('publicCopilotPostingDescription2').setContent($('#publicDescriptionText').html());
        return false;
    });

    $('#savePublicDesc').click(function() {
        hideEdit($(this));
        updatePublicDesc();
        return false;
    });

    $('#cancelPrivateDesc').click(function() {
        hideEdit($(this));
        tinyMCE.get('privateCopilotPostingDescription2').setContent($('#privateDescriptionText').html());
        return false;
    });

    $('#savePrivateDesc').click(function() {
        hideEdit($(this));
        updatePrivateDesc();
        return false;
    });

    $('#cancelFiles').click(function() {
        hideEdit($(this));
        restorePrevData();
        return false;
    });

    $('#saveFiles').click(function() {
        hideEdit($(this));
        updateProjectFiles();
        return false;
    });

    // add project
    initDialog('addProjectDialog', 500);

    $('#addProjectDialog').bind('dialogopen', function(event, ui) {
        $('#addProjectForm').show();
        clearDialog('addProjectForm');

        $('#addProjectResult').hide();
        $('#addProjectResult').find('p').html('');
    });

    $('#addNewProject2').click(function() {
        $('#addProjectDialog').dialog('open');
        return false;
    });

    // Upload file
    // Document uploader set up - Screen 2
    var uploader2 =
            new AjaxUpload(null, {
                action: ctx + '/copilot/documentUpload',
                name : 'document',
                responseType : 'json',
                onSubmit : function(file, ext) {
                    currentDocument['fileName'] = file;
                    uploader2.setData({contestFileDescription : currentDocument['description'], documentTypeId : 0, studio: false});
                    $.blockUI({ message: '<div id=loading> loading.... </div>' });
                },
                onComplete : function(file, jsonResult) {
                    handleJsonResult(jsonResult,
                                     function(result) {
                                         currentDocument['documentId'] = result.documentId;
                                         documents2.push(currentDocument);
                                         addFileItem(currentDocument);
                                         currentDocument = {};
                                         $('#fileDescription2').val('');
                                         $('#fakeTextInput2').val('');
                                         $.unblockUI();
                                     },
                                     function(errorMessage) {
                                         showErrors(errorMessage);
                                         $.unblockUI();
                                     });
                }
            }, false);

    $('#fileUploadBtn2').click(function() {
        var fileName = uploader2._input.value;
        var description = $('#fileDescription2').val();

        var errors = [];

        if (!checkRequired(fileName)) {
            errors.push('No file is selected.');
        }

        if (!checkRequired(description)) {
            errors.push('File description is empty.');
        }

        if (errors.length > 0) {
            showErrors(errors);
            return false;
        }

        currentDocument['description'] = description;

        uploader2.submit();
    });

});

/* function to style the input file */
(function($) {
    $.fn.styleingInputFile = function() {
        this.each(function() {
            var fileInput = $(this);
            var parentWrap = fileInput.parents(".attachFile");
            var wrapOffset = parentWrap.offset();
            fileInput.attr("style",
                           "opacity: 0;-moz-opacity: 0;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);")
            parentWrap.mousemove(function(event) {
                fileInput.blur();
                var relatedX = event.pageX - wrapOffset.left - fileInput.width() + 12;
                var relatedY = event.pageY - wrapOffset.top;
                fileInput.css("left", relatedX + "px");
                fileInput.css("top", "0px");
            });
            fileInput.change(function() {
                $(this).blur();
                parentWrap.find(".fakeText input").val($(this).val());
            })
        })
    }
})(jQuery);

/**
 * Adds a new project.
 */
function addNewProject() {
    var projectName = $('#addProjectForm').find('input[name="projectName"]').val();
    var projectDescription = $('#addProjectForm').find('input[name="projectDescription"]').val();

    var errors = [];

    if (!checkRequired(projectName)) {
        errors.push('project name is empty.');
    }

    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    $.ajax({
        type: 'POST',
        url:  "createProject",
        data: {'projectName' : projectName, 'projectDescription' : projectDescription},
        cache: false,
        dataType: 'json',
        success: function(jsonResult) {
            handleJsonResult(jsonResult,
                             function(result) {
                                 $("<option/>").val(result.projectId).text(result.name).appendTo("#projects");
                                 $('#projects').resetSS();
                                 $('#projects').getSetSSValue(result.projectId);

                                 $("<option/>").val(result.projectId).text(result.name).appendTo("#projects2");
                                 $('#projects2').resetSS();
                                 $('#projects2').getSetSSValue(result.projectId);

                                 $('#addProjectForm').hide();
                                 $('#addProjectResult').show();
                                 $('#addProjectResult').find('p').html('Project is created successfully.');

                             },
                             function(errorMessage) {
                                 $('#addProjectForm').hide();
                                 $('#addProjectResult').show();
                                 $('#addProjectResult').find('p').html(errorMessage);
                             });
        }
    });
}

function addFileItem(doc) {
    var template = unescape($('#uploadedDocumentTemplate').html());
    var html = $.validator.format(template, doc['documentId'], doc['fileName'], doc['description']);
    $('.fileUpload dl').append(html);
}

function removeFileItem(documentId, docs) {
    $('#doc' + documentId).remove();
    $.each(docs, function(i, doc) {
        if (doc && doc.documentId == documentId) {
            docs.splice(i, 1);
        }
    });
}

function getDatePart(d) {
    if (d == null) {
        return null;
    }
    return d.toString("MM/dd/yyyy");
}

function getTimePart(d) {
    if (d == null) {
        return null;
    }
    return d.toString("HH:mm");
}

function getDate(datePart, timePart) {
    return Date.parse(datePart + ' ' + timePart + ' EST', 'MM/dd/yyyy HH:mm EST');
}

function getDateByIdPrefix(idPrefix) {
    return getDate($('#' + idPrefix + 'DateInput').val(), $('#' + idPrefix + 'TimeInput').val());
}

function hideEdit(cancelButton) {
    var mask = cancelButton.parents(".editMask");
    mask.find(".editPanel").hide();
    mask.find(".infoPanel").show();
}

function restorePrevData() {
    documents2 = [];
    var template = unescape($('#uploadedDocumentTemplate').html());
    $('#uploadedDocumentsTable').html('');
    $('#fileUpload2 dl').remove('.uploadedDocumentItem');
    for (var i = 0; i < documents.length; i++) {
        var doc = documents[i];
        var d = '<tr><td class="fileName"><span>' + (i + 1) + '.</span> <a href="javascript:">' + doc['fileName']
                + '</a></td> <td class="fileDesc">' + doc['description'] + '</td></tr>';
        $('#uploadedDocumentsTable').append(d);

        var html = $.validator.format(template, doc['documentId'], doc['fileName'], doc['description'], '2');
        $('#fileUpload2 dl').append(html);
        documents2[i] = doc;
    }
}

function updateProjectGeneralInfo() {
    var contestName = $('#contestNameInput2').val();
    var projectName = $('#projects2 option:selected').text();
    var accountName = $('#billingProjects2 option:selected').text();
    var projectId = $('#projects2').val();
    var accountId = $('#billingProjects2').val();

    $('#contestNameTextLabel').html(contestName);
    $('#projectNameTextLabel').html(projectName);
    $('#billingProjectNameTextLabel').html(accountName);
    $('#projects').val(projectId);
    $('#contestNameInput').val(contestName);
    $('#billingProjects').val(accountId);
    
    sendSaveDraftRequestToServer();
}

function updateProjectDate() {
    var startDate = $('#start2DateInput').datePicker().val();
    var startTime = $('#start2TimeInput').val();

    $('#startDateLabel').html(startDate + ' at ' + startTime + ' EST (GMT-04)');
    $('#startDateInput').datePicker().val(startDate);
    $('#startTimeInput').val(startTime);
    
    sendSaveDraftRequestToServer();
    
}

function updatePublicDesc() {
    var publicDescription = tinyMCE.get('publicCopilotPostingDescription2').getContent();
    $('#publicDescriptionText').html(publicDescription);

    sendSaveDraftRequestToServer();
}

function updatePrivateDesc() {
    var privateDescription = tinyMCE.get('privateCopilotPostingDescription2').getContent();
    $('#privateDescriptionText').html(privateDescription);
    sendSaveDraftRequestToServer();
}

function updateProjectFiles() {
    $('#uploadedDocumentsTable').html('');
    $('#fileUpload dl').html('');

    for (var i = 0; i < documents2.length; i++) {
        var doc = documents2[i];
        var d = '<tr><td class="fileName"><span>' + (i + 1) + '.</span> <a href="javascript:">' + doc['fileName']
                + '</a></td> <td class="fileDesc">' + doc['description'] + '</td></tr>';
        $('#uploadedDocumentsTable').append(d);
    }
    documents = documents2;
    documents2 = [];
    for (var i = 0; i < documents.length; i++) {
        documents2.push(documents[i]);
    }
    
    sendSaveDraftRequestToServer();
}

function validateContestInput() {
    // Validate form data
    var contestName = $('#contestNameInput').val();
    var projectId = $('#projects').val();
    var accountId = $('#billingProjects').val();

    var errors = [];
    if (projectId == '-1') {
        errors.push('Project is not selected');
    }
    if (!checkRequired(contestName)) {
        errors.push('Contest name is empty');
    }
    if (accountId == '0') {
        errors.push('Billing account is not selected');
    }

    var startDate = getDateByIdPrefix('start');
    var endDate = getDateByIdPrefix('end');

    if (startDate >= endDate) {
        errors.push('Start date should be before end date.');
    }
    return errors;
}


/**
 * Activate software contest.
 */
function activateContest() {
    var request = saveAsDraftRequest();
    request['activation'] = true;

    $.ajax({
        type: 'POST',
        url:  "saveDraftContest",
        data: request,
        cache: false,
        dataType: 'json',
        success: handleActivationResult,
        beforeSend: beforeAjax,
        complete: afterAjax
    });
}

function saveAsDraftRequest() {
    var request = {};

    request['projectId'] = projectId;
    request['contestId'] = -1;
    request['tcDirectProjectId'] = $('#projects2').val();
    request['competitionType'] = 'SOFTWARE';

    request['assetDTO.name'] = $('#contestNameInput2').val();
    request['assetDTO.productionDate'] = $('#start2DateInput').datePicker().val() +"T" 
                                         + $('#start2TimeInput').val() + ":00";

    request['projectHeader.id'] = projectId;
    request['projectHeader.tcDirectProjectId'] = $('#projects2').val();
    request["projectHeader.properties['Billing Project']"] = $('#billingProjects2').val();
    request["projectHeader.properties['Project Name']"] = $('#contestNameInput2').val();
    request['projectHeader.projectSpec.detailedRequirements'] = tinyMCE.get('publicCopilotPostingDescription2').getContent();
    request['projectHeader.projectSpec.privateDescription'] = tinyMCE.get('privateCopilotPostingDescription2').getContent();
    request['projectHeader.tcDirectProjectName'] = $.trim($('#projects2 option:selected').text());

    request['docUploadIds'] = getDocumentIds();

    return request;
}

function getDocumentIds() {
    return $.map(documents, function(doc, i) {
        return doc.documentId;
    });
}


/**
 * Handle contest draft saving result.
 *
 * @param jsonResult the json result
 */
function handleDraftSaving(jsonResult) {
    handleJsonResult(jsonResult,
                     function(result) {
                         projectId = result.projectId;
                         $("#saveAsDraft").overlay({
                             closeOnClick:false,
                             mask: {
                                 color: '#000000',
                                 loadSpeed: 200,
                                 opacity: 0.6
                             },
                             top:"20%",
                             close :"#saveAsDraftOK",
                             fixed : true,
                             load: true
                         });

                     },
                     function(errorMessage) {
                         showErrors(errorMessage);
                     });
}

function sendSaveDraftRequestToServer() {
    // Send request to server
    var request = saveAsDraftRequest();
    $.ajax({
        type: 'POST',
        url:  "saveDraftContest",
        data: request,
        cache: false,
        dataType: 'json',
        success: handleDraftSaving,
        beforeSend: function() {
            $.blockUI({ message: '<div id=loading> loading.... </div>' });
        },
        complete: function() {
            $.unblockUI();
        }
    });
}

/**
 * Activation in edit page
 */
function activateContestEdit() {
    var billingProjectId = $('#billingProjects2').val();
    if (billingProjectId <= 0) {
        showErrors("no billing project is selected.");
        return;
    }


    //construct request data
   var request = saveAsDraftRequest();
   request['activationFlag'] = true;

   $.ajax({
      type: 'POST',
      url:  ctx + "/launch/saveDraftContest",
      data: request,
      cache: false,
      dataType: 'json',
      success: handleActivationResultEdit,
      beforeSend: beforeAjax,
      complete: afterAjax            
   });  
      
}

function handleActivationResultEdit(jsonResult) {
    handleJsonResult(jsonResult,
                     function(result) {
                         $('#resubmit').hide();
                         $("#savedAsDraftAndActivated").overlay({
                             closeOnClick:false,
                             mask: {
                                 color: '#000000',
                                 loadSpeed: 200,
                                 opacity: 0.6
                             },
                             top:"20%",
                             close :"#saveAsDraftOK2",
                             fixed : true,
                             load: true
                         });
                     },
                     function(errorMessage) {
                         showErrors(errorMessage);
                     });
}
function beforeAjax() {
	 $.blockUI({ message: '<div id=loading> loading.... </div>' });
}

function afterAjax() {
	 $.unblockUI();
}