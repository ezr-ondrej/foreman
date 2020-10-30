module Api
  module V2
    module ExtractedPuppetController
      extend ActiveSupport::Concern

      included do
        prepend_before_action :fail_and_inform_about_plugin

        resource_description do
          desc 'This resource has been deprecated, to continue using it please install Foreman Puppet Enc plugin and use its API enpoints.'
          deprecated true
        end
      end

      def resource_human_name
        resource_class.model_name.name
      end

      def fail_and_inform_about_plugin
        render json: { message: _('To access %s API you need to install Foreman Puppet Enc plugin') % resource_human_name }, status: :not_implemented
      end
    end
  end
end
