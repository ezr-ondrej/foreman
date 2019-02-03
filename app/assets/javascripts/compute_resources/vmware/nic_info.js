providerSpecificNICInfo = function(form) {
  var vmware_network_name,
    $vmware_network_field = form.find('.vmware_network');

  if ($vmware_network_field.is('select')) {
    vmware_network_name = $vmware_network_field.find('option:selected').text();
  } else {
    vmware_network_name = $vmware_network_field.val();
  }

  return form.find('.vmware_type').val() + ' @ ' + vmware_network_name;
}
