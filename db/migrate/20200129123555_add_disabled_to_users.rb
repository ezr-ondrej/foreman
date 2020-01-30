class AddDisabledToUsers < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :disabled, :boolean, default: false
  end
end
