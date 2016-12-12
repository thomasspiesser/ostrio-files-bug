import { FilesCollection } from 'meteor/ostrio:files';

// See https://github.com/VeliovGroup/Meteor-Files/wiki
// for full FilesCollection API.
const Files = new FilesCollection({
    // Change to `true` for debugging
    debug: true,
    collectionName: 'files',
    protected(fileObj) {
        var session = this.params.query.xmtok;
        var userId  = (Meteor.server.sessions[session] && Meteor.server.sessions[session].userId) ? Meteor.server.sessions[session].userId : null;
        this.userId = userId;
        this.user   = function () {
            return userId;
        };
        console.log('this.userId', this.userId);
        console.log('this.user()', this.user());
        if (fileObj) {
            if (this.userId === fileObj.userId) {
                return true;
            }
        }
        return false;
    },
});

export { Files };

if (Meteor.isServer) {
    Files.denyClient();
    Meteor.publish('files.all', function () {
        return Files.find().cursor;
    });

} else {
    Meteor.subscribe('files.all');
}