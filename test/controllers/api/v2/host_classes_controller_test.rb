require 'test_helper'

class Api::V2::HostClassesControllerTest < ActionController::TestCase
  test "should not get index" do
    skip('Foreman Puppet Enc plugin is installed') if Foreman::Plugin.find(:foreman_puppet_enc)
    get :index, params: { host_id: 123 }
    assert_response :not_implemented
    json_response = ActiveSupport::JSON.decode(response.body)
    assert_equal json_response['message'], 'To access HostClass API you need to install Foreman Puppet Enc plugin'
  end

  test "should not show" do
    skip('Foreman Puppet Enc plugin is installed') if Foreman::Plugin.find(:foreman_puppet_enc)
    get :create, params: { host_id: 123 }
    assert_response :not_implemented
    json_response = ActiveSupport::JSON.decode(response.body)
    assert_equal json_response['message'], 'To access HostClass API you need to install Foreman Puppet Enc plugin'
  end

  test "should not update" do
    skip('Foreman Puppet Enc plugin is installed') if Foreman::Plugin.find(:foreman_puppet_enc)
    patch :destroy, params: { host_id: 123, id: 124 }
    assert_response :not_implemented
    json_response = ActiveSupport::JSON.decode(response.body)
    assert_equal json_response['message'], 'To access HostClass API you need to install Foreman Puppet Enc plugin'
  end
end
