require 'rails_helper'


RSpec.describe User, type: :model do

  describe "Test Permission." do
    context "normal:" do
      it "not admin" do
        user = User.new
        expect(user.isAdmin).to be false
        user.permission = 'normal'
        expect(user.isAdmin).to be false
      end
    end
    context "admin:" do
      it "is admin" do
        user = User.new
        user.permission = 'admin'
        expect(user.isAdmin).to be true
      end
    end
  end
end