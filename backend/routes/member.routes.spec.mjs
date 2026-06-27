import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";
import { karmicKudosCheck } from "./member.routes.mjs";
import Member from "../models/member.mjs";

describe("karmicKudosCheck", () => {
  let member;
  let updateKarmicKudosStub;
  let findByIdStub;

  beforeEach(() => {
    updateKarmicKudosStub = sinon.stub(Member, "updateKarmicKudos");
    findByIdStub = sinon.stub(Member, "findById");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should assign a new ObjectId to member.referer if referer is not a valid ObjectId", () => {
    member = { referer: "invalid-id" };
    karmicKudosCheck(member, false);

    expect(mongoose.Types.ObjectId.isValid(member.referer)).to.be.true;
    expect(updateKarmicKudosStub.called).to.be.false;
    expect(findByIdStub.called).to.be.false;
  });

  it("should update karmic kudos if updateMode is true, member.referer has _id, and checkMember.referer is falsy", () => {
    const validId = mongoose.Types.ObjectId();
    const refererId = mongoose.Types.ObjectId();
    member = { _id: validId, referer: { _id: refererId.toString() } };

    const isValidStub = sinon.stub(mongoose.Types.ObjectId, "isValid").returns(true);

    const mockExec = sinon.stub().yields(null, { referer: null });
    const mockPopulate = sinon.stub().returns({ exec: mockExec });
    findByIdStub.returns({ populate: mockPopulate });

    karmicKudosCheck(member, true);

    expect(isValidStub.calledOnce).to.be.true;
    expect(findByIdStub.calledOnceWith(member._id)).to.be.true;
    expect(mockPopulate.calledOnceWith("referer")).to.be.true;
    expect(mockExec.calledOnce).to.be.true;
    expect(updateKarmicKudosStub.calledOnceWith(member.referer, 10)).to.be.true;
  });

  it("should not update karmic kudos if updateMode is true, member.referer has _id, but checkMember.referer is truthy", () => {
    const validId = mongoose.Types.ObjectId();
    const refererId = mongoose.Types.ObjectId();
    member = { _id: validId, referer: { _id: refererId.toString() } };

    const isValidStub = sinon.stub(mongoose.Types.ObjectId, "isValid").returns(true);

    const mockExec = sinon.stub().yields(null, { referer: "some-referer" });
    const mockPopulate = sinon.stub().returns({ exec: mockExec });
    findByIdStub.returns({ populate: mockPopulate });

    karmicKudosCheck(member, true);

    expect(isValidStub.calledOnce).to.be.true;
    expect(findByIdStub.calledOnceWith(member._id)).to.be.true;
    expect(mockPopulate.calledOnceWith("referer")).to.be.true;
    expect(mockExec.calledOnce).to.be.true;
    expect(updateKarmicKudosStub.called).to.be.false;
  });

  it("should update karmic kudos if updateMode is false and member.referer is a valid ObjectId", () => {
    const refererId = mongoose.Types.ObjectId();
    member = { referer: refererId };

    karmicKudosCheck(member, false);

    expect(findByIdStub.called).to.be.false;
    expect(updateKarmicKudosStub.calledOnceWith(member.referer, 10)).to.be.true;
  });
});
