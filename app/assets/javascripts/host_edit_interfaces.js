$(document).ready(function() {
  $('#host_name').select();
  $('#host_name').focus();
})

function show_interface_modal(modal_content) {
  var modal_window = $('#interfaceModal');
  var interface_id = modal_content.data('interface-id');

  modal_window.data('current-id', interface_id);

  var identifier = modal_content.find('.interface_identifier').val();

  modal_window.find('.modal-body').html('');
  modal_window.find('.modal-body').append(modal_content.contents());
  modal_window.find('.modal-title').text(__('Interface') + ' ' + String(identifier));
  modal_window.modal({'show': true});

  modal_window.find('a[rel="popover-modal"]').popover();
  activate_select2(modal_window);
}

function save_interface_modal() {
  var modal_window = $('#interfaceModal');
  var interface_id = modal_window.data('current-id');
  var is_new = modal_window.data('new-interface');

  //destroy ui tools so when opening the modal again they will show correctly
  modal_window.find('a[rel="popover-modal"]').popover('destroy');
  modal_window.find('select').select2('destroy')

  // mark the selected values to preserve them for form hiding
  preserve_selected_options(modal_window);

  var modal_form = modal_window.find('.modal-body').contents();

  var interface_hidden = $(tfm.hosts.getInterfaceHiddenFields(interface_id));
  interface_hidden.html('');
  interface_hidden.append(modal_form);

  close_interface_modal();
  if (is_new) {
    add_interface(interface_id, interface_hidden);
  } else {
    update_interface_info(interface_id, interface_hidden);
  }
}

function close_interface_modal() {
  var modal_window = $('#interfaceModal');

  modal_window.modal('hide');
  modal_window.removeData('current-id');
  modal_window.removeData('new-interface');
  modal_window.find('.modal-body').html('');
}

function get_interface_data(interface_form) {
  return {
    name: interface_form.find('.interface_name').val(),
    domain: interface_form.find('.interface_domain option:selected').text(),
    type: interface_form.find('.interface_type').val(),
    typeName: interface_form.find('.interface_type option:selected').text(),
    identifier: interface_form.find('.interface_identifier').val(),
    mac: interface_form.find('.interface_mac').val(),
    ip: interface_form.find('.interface_ip').val(),
    ip6: interface_form.find('.interface_ip6').val(),
    primary: interface_form.find('.interface_primary').is(':checked'),
    provision: interface_form.find('.interface_provision').is(':checked'),
    virtual: interface_form.find('.virtual').is(':checked'),
    attachedTo: interface_form.find('.attached').val(),
    providerSpecificInfo: providerSpecificInterfaceInfo(interface_form),
    hasErrors: interface_form.find('.has-error').length > 0,
    editing: false,
  };
}

function add_interface(interface_id, interface_form) {
  var interfaceData = get_interface_data(interface_form);
  interfaceData.id = interface_id;
  tfm.hosts.addInterface(interfaceData);
}

function update_interface_info(interface_id, interface_form) {
  var interfaceData = get_interface_data(interface_form);
  tfm.hosts.updateInterface(interface_id, interfaceData);
}

function active_interface_forms() {
  return $.grep($('#interfaceForms > div'), function(f) {
    var flag = $(f).find('.destroyFlag').val();
    return (flag == false || flag == undefined);
  });
}

function confirm_flag_change(element, element_selector, massage) {
  if (!$(element).is(':checked'))
    return;

  var this_interface_id = $('#interfaceModal').data('current-id');

  var other_selected;
  other_selected = $(active_interface_forms()).find(element_selector + ':checked').closest('fieldset');
  other_selected = $.grep(other_selected, function(i) {
    return ($(i).parent().data('interface-id') != this_interface_id);
  });

  if (other_selected.length > 0) {
    return confirm(massage);
  }
}

function primary_nic_form() {
  return $(active_interface_forms()).find('.interface_primary:checked').closest('fieldset');
}

$(document).on('click', '.interface_primary', function () {
  var confirmed = confirm_flag_change(this, '.interface_primary',
    __("Some other interface is already set as primary. Are you sure you want to use this one instead?")
  );

  if (confirmed) {
    // preset dns name from host name if it's blank
    var name = $(this).closest('fieldset').find('.interface_name');
    if (name.val().length == 0)
      name.val($('#host_name').val());
  }

  return confirmed;
});

$(document).on('click', '.interface_provision', function () {
  return confirm_flag_change(this, '.interface_provision',
    __("Some other interface is already set as provisioning. Are you sure you want to use this one instead?")
  );
});

$(document).on('change', '#host_name', function () {
  // copy host name to the primary interface's name
  tfm.hosts.setPrimaryInterfaceName($(this).val());
});

var providerSpecificNICInfo = null;
function providerSpecificInterfaceInfo(formFields) {
  if (typeof window.providerSpecificNICInfo === 'function')
    return window.providerSpecificNICInfo($(formFields));
  return null;
};

$(document).on('change', '.compute_attributes', function () {
  // remove "from profile" note if any of the fields changes
  $(this).closest('.compute_attributes').find('.profile').html('');
});

$(document).on('change', '.virtual', function () {
  var is_virtual = $(this).is(':checked');

  $(this).closest('fieldset').find('.virtual_form').toggle(is_virtual);
  $(this).closest('fieldset').find('.compute_attributes').toggle(!is_virtual);
});

$(document).on('change', '.interface_mac', function (event) {
  if (event.target.id == $('#interfaceModal').find('.interface_mac').attr('id')) {
    var interface = $('#interfaceModal').find('.interface_mac');
    var mac = interface.val();
    var baseurl = interface.attr('data-url');
    $.ajax({
      type: "GET",
      url: baseurl + '?mac=' + mac,
      success: function(response, status, xhr) {
        if ($('#host_name').val() == '')
          $('#host_name').val(response.name);
        if ($('#interfaceModal').find('.interface_name').val() == '')
          $('#interfaceModal').find('.interface_name').val(response.name);
      }
    });
  }
});
