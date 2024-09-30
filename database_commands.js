const mongoose = require('mongoose');
const {Command} = require('commander');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/yourdbname')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err.message));

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    tags: [{type: String}],
    graduationYear: {type: Number}
});

const User = mongoose.model('User', userSchema);

const program = new Command();

program
    .command('list-users')
    .description('List all users')
    .action(async () => {
        try {
            const users = await User.find().select('-password');
            console.log('Users:', users);
        } catch (err) {
            console.error('Error fetching users:', err.message);
        } finally {
            mongoose.connection.close();
        }
    });

program
    .command('add-tag <email> <tag>')
    .description('Add a tag to a user')
    .action(async (email, tag) => {
        try {
            const user = await User.findOneAndUpdate(
                {email},
                {$addToSet: {tags: tag}},
                {new: true}
            );
            if (!user) {
                console.error('User not found');
                return;
            }
            console.log('Updated User:', user);
        } catch (err) {
            console.error('Error adding tag:', err.message);
        } finally {
            mongoose.connection.close();
        }
    });

program
    .command('remove-tag <email> <tag>')
    .description('Remove a tag from a user')
    .action(async (email, tag) => {
        try {
            const user = await User.findOneAndUpdate(
                {email},
                {$pull: {tags: tag}},
                {new: true}
            );
            if (!user) {
                console.error('User not found');
                return;
            }
            console.log('Updated User:', user);
        } catch (err) {
            console.error('Error removing tag:', err.message);
        } finally {
            mongoose.connection.close();
        }
    });

program.parse(process.argv);