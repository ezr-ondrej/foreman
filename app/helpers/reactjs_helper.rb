module ReactjsHelper
  def mount_react_component(name, selector, data = [], opts = {})
    javascript_tag defer: 'defer' do
      "$(tfm.reactMounter.mount('#{name}', '#{selector}', #{data}, #{opts[:flatten_data] || false}));".html_safe
    end
  end

  # Mount react component in views
  # Params:
  # +name+:: the component name from the componentRegistry
  # +data+:: data to pass to the component as props
  #          available values: Hash, json-string, nil
  # +opts[:flatten_data]+:: false = will pass the props to the component props.data
  #                         true = will pass the props directly to the component props
  def react_component(name, data = [], opts = {})
    data = data.to_json if data.is_a?(Hash)

    attributes = {
      :name => name,
      :data => { props: data },
      'flatten-data' => opts[:flatten_data]
    }

    content_tag('react-component', '', attributes)
  end

  def webpacked_plugins_js_for(*plugin_names)
    js_tags_for(select_requested_plugins(plugin_names)).join.html_safe
  end

  def webpacked_plugins_with_global_js
    js_tags_for_global_files(Foreman::Plugin.with_global_js.map { |plugin| { id: plugin.id, files: plugin.global_js_files } }).join.html_safe
  end

  def webpacked_plugins_css_for(*plugin_names)
    css_tags_for(select_requested_plugins(plugin_names)).join.html_safe
  end

  def select_requested_plugins(plugin_names)
    available_plugins = Foreman::Plugin.with_webpack.map(&:id)
    missing_plugins = plugin_names - available_plugins
    if missing_plugins.any?
      logger.error { "Failed to include webpack assets for plugins: #{missing_plugins}" }
      raise ::Foreman::Exception.new("Failed to include webpack assets for plugins: #{missing_plugins}") if Rails.env.development?
    end
    plugin_names & available_plugins
  end

  def js_tags_for(requested_plugins)
    requested_plugins.map do |plugin|
      javascript_include_tag(*webpack_asset_paths(plugin.to_s, :extension => 'js'), "data-turbolinks-track" => true)
    end
  end

  def js_tags_for_global_files(requested_plugins)
    requested_plugins.map do |plugin|
      plugin[:files].map do |file|
        javascript_include_tag(*webpack_asset_paths(plugin[:id].to_s + ":#{file}", :extension => 'js'), "data-turbolinks-track" => true, :defer => "defer")
      end
    end
  end

  def css_tags_for(requested_plugins)
    requested_plugins.map do |plugin|
      stylesheet_link_tag(*webpack_asset_paths(plugin.to_s, :extension => 'css'), "data-turbolinks-track" => true)
    end
  end
end
