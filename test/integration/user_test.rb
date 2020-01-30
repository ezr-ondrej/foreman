require 'integration_test_helper'

class UserIntegrationTest < IntegrationTestWithJavascript
  # intermittent failures:
  #   UserIntegrationTest.test_0002_edit page

  test "index page" do
    assert_index_page(users_path, "Users", "Create User")
  end

  test "edit page" do
    visit users_path
    click_link "one"
    fill_in "user_firstname", :with => "user12345"
    assert_submit_button(users_path)
    assert page.has_content? 'user12345'
  end

  context "without automatic login" do
    test "login" do
      login_user(users(:admin).login, "secret")
    end

    test "attempt to login disabled user via internal authentication" do
      user(:one).update(disabled: true)
      login_user(users(:one).login, "secret", false)
      assert page.has_content? 'disabled'
    end

    test "attempt to login disabled user via external authentication" do
      login_user(users(:external_disabled).login, "password", false)
      assert page.has_content? 'disabled'
    end
  end

  test "create new user" do
    visit users_path
    click_link "Create User"
    assert fill_in "user_login", :with => "new_user"
    find("#s2id_user_auth_source_id").click
    all(".select2-result-label").find do |result|
      result.text == 'INTERNAL'
    end.click
    assert click_button("Submit")
    assert page.has_content?("can't be blank")
    assert fill_in "user_password", :with => "123456"
    assert fill_in "password_confirmation", :with => "123456"
    assert_submit_button(users_path)
    assert find_link('new_user').visible?
  end
end
