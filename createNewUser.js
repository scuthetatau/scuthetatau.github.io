const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const createNewUser = async () => {
    const hashedPassword = await bcrypt.hash('password', 10);

    const newUser = {
        email: 'aaylen@scu.edu',
        password: hashedPassword,
        firstName: 'Alexander',
        lastName: 'Aylen',
        graduationYear: 2027,
        family: 'Smith',
        class: 'A1',
        role: 'Admin',
        points: 0
    };

    let users = [];

    // Check if the file exists
    if (fs.existsSync('users.xlsx')) {
        // Read the existing file
        const workbook = xlsx.readFile('users.xlsx');
        const worksheet = workbook.Sheets['Users'];
        // Convert the sheet to JSON
        users = xlsx.utils.sheet_to_json(worksheet);
    }

    // Append the new user to the users array
    users.push(newUser);

    // Convert JSON to sheet
    const newWorksheet = xlsx.utils.json_to_sheet(users, {header: ['email', 'password', 'firstName', 'lastName', 'graduationYear', 'family', 'class', 'role', 'points']});
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, 'Users');

    // Write the workbook to a file
    xlsx.writeFile(newWorkbook, 'users.xlsx');
    console.log('users.xlsx updated with a new user.');
};

createNewUser();