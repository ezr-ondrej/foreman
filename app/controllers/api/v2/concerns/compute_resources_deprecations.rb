module Api
  module V2
    module Concerns
      module ComputeResourcesDeprecations
        extend ActiveSupport::Concern

        included do

          before_action :find_resource, :only => [:deprecated_available_storage_domains, :deprecated_available_storage_pods]

          api :GET, "/compute_resources/:id/available_storage_domains/:storage_domain", N_('Deprecated') + ': ' + N_("List attributes for a given storage domain")
          param :id, :identifier, :required => true
          param :storage_domain, String
          def deprecated_available_storage_domains
            Foreman::Deprecation.api_deprecation_warning("use /compute_resources/:id/storage_domain/:storage_domain_id endpoind instead")
            @available_storage_domains = [@compute_resource.storage_domain(params[:storage_domain])]
            @total = @available_storage_domains&.size
            render :available_storage_domains, :layout => 'api/v2/layouts/index_layout'
          end

          api :GET, "/compute_resources/:id/available_storage_pods/:storage_pod", N_('Deprecated') + ': ' + N_("List attributes for a given storage pod")
          param :id, :identifier, :required => true
          param :storage_pod, String
          def deprecated_available_storage_pods
            Foreman::Deprecation.api_deprecation_warning("use /compute_resources/:id/storage_pod/:storage_pod_id endpoind instead")
            @available_storage_pods = [@compute_resource.storage_pod(params[:storage_pod])]
            @total = @available_storage_pods&.size
            render :available_storage_pods, :layout => 'api/v2/layouts/index_layout'
          end

        end
      end
    end
  end
end
