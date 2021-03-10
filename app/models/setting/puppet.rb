class Setting::Puppet < Setting
  def self.default_settings
    [
      set('puppet_interval', N_("Duration in minutes after servers reporting via Puppet are classed as out of sync."), 35, N_('Puppet interval')),
      set('puppet_out_of_sync_disabled', N_("Disable host configuration status turning to out of sync for %s after report does not arrive within configured interval") % 'Puppet', false, N_('%s out of sync disabled') % 'Puppet'),
      set('default_puppet_environment', N_("Foreman will default to this puppet environment if it cannot auto detect one"), "production", N_('Default Puppet environment'), nil, { :collection => proc { Hash[Environment.all.map { |env| [env[:name], env[:name]] }] } }),
      set('enc_environment', N_("Foreman will explicitly set the puppet environment in the ENC yaml output. This will avoid conflicts between the environment in puppet.conf and the environment set in Foreman"), true, N_('ENC environment')),
      set('update_environment_from_facts', N_("Foreman will update a host's environment from its facts"), false, N_('Update environment from facts')),
    ]
  end

  def self.humanized_category
    N_('Puppet')
  end
end
