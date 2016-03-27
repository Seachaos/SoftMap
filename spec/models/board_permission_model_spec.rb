require 'rails_helper'


RSpec.describe BoardPermission, type: :model do

  describe "Test Permission" do
    let(:creator){
      user = User.new
      user.save
      return user
    }
    let(:editor){
      user = User.new
      user.save
      return user
    }
    let(:viewer){
      user = User.new
      user.save
      return user
    }
    let(:guest){
      user = User.new
      user.save
      return user
    }
    let(:board_private){
      board = Board.new
      board.name = 'TB_Private'
      board.public_state = 0
      expect(board.save).to be true
      expect(board.id).to be > 0
      return board
    }


    it "check user id" do
      expect(creator.id).to be > 0
      expect(creator.id).not_to be == editor.id
      expect(editor.id).not_to be == viewer.id
      expect(viewer.id).not_to be == guest.id
      expect(creator.id).not_to be == guest.id
    end

    context "Privte Board:" do
      let(:board){ board_private }

      context "Creator" do
        before(:each) do
          expect(creator.id).to be > 0
          expect(BoardPermission.setBoardPermission(creator.id, board.id, 'Creator')).to be true
        end

        it "basic check" do
          user = creator

          bpuser = BoardPermission.where('user_id=?', user.id).first
          expect(bpuser.id).to be > 0
          expect(bpuser.user_id).to be == user.id
          expect(bpuser.user_id).to be == creator.id
          expect(bpuser.permission).to eq('Creator')
        end

        it "check" do
          user = creator

          expect(BoardPermission.last.user_id).to be == user.id
          expect(board.permissionForView(user)).to be true
          expect(board.permissionForEdit(user)).to be true
          expect(board.permissionForSetting(user)).to be true
        end

      end

      context "Editor" do
        before(:each) do
          expect(BoardPermission.setBoardPermission(editor.id, board.id, 'Editor')).to be true
        end
        it "check" do
          user = editor
          expect(board.permissionForView(user)).to be true
          expect(board.permissionForEdit(user)).to be true
          expect(board.permissionForSetting(user)).to be false
        end
      end

      context "Viewer" do
        before(:each) do
          expect(BoardPermission.setBoardPermission(viewer.id, board.id, 'Viewer')).to be true
        end
        it "check" do
          user = viewer
          expect(board.permissionForView(user)).to be true
          expect(board.permissionForEdit(user)).to be false
          expect(board.permissionForSetting(user)).to be false
        end
      end

      context "User" do
        before(:each) do
          expect(BoardPermission.setBoardPermission(guest.id, board.id, 'None')).to be true
        end
        it "check" do
          user = guest
          expect(board.permissionForView(user)).to be false
          expect(board.permissionForEdit(user)).to be false
          expect(board.permissionForSetting(user)).to be false
        end
      end
    end

  end
end