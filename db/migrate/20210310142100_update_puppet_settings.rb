class UpdatePuppetSettings < ActiveRecord::Migration[6.0]
  def up
    Setting.where(name: 'ignore_interface_facts_for_provisioning').delete_all # The setting gets created before db:migrate
    Setting.where(name: 'ignore_puppet_facts_for_provisioning').update_all(name: 'ignore_interface_facts_for_provisioning')
    Setting.where(name: moved_settings).update_all(category: 'Setting::Provisioning')
  end

  def down
    Setting.where(name: moved_settings).update_all(category: 'Setting::Puppet')
    Setting.where(name: 'ignore_interface_facts_for_provisioning').update_all(name: 'ignore_puppet_facts_for_provisioning')
  end

  private

  def moved_settings
    %w[
      ignore_interface_facts_for_provisioning
      matchers_inheritance
      Default_parameters_Lookup_Path
      interpolate_erb_in_parameters
      update_subnets_from_facts
      update_hostgroup_from_facts
      create_new_host_when_facts_are_uploaded
      create_new_host_when_report_is_uploaded
      location_fact
      organization_fact
      default_location
      default_organization
      always_show_configuration_status
      use_uuid_for_certificates
    ]
  end
end
