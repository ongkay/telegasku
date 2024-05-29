// Compiled using dbsheet 1.0.0 (TypeScript 4.9.5)
function testUser() {
    var db = Dbsheet.init('1fqw7NyUXoW7tAeTjpaGqjnm7c804tW8iBKBeE2MZuE8');
    var columns = ['name', 'email'];
    db.createSheetIfNotExists('users', columns);
    var userSheet = db.sheet('users');
    
    // insert satu data
    userSheet.insert({
        name: 'Asepudin',
        email: 'asep@gmail.com'
    });
    
    // insert banyak data
    userSheet.insert([
        {
            name: 'Binsar Dwi Jasuma',
            email: 'binsarjr121@gmail.com'
        },
        {
            name: 'Asepudin',
            email: 'asep@gmail.com'
        },
        {
            name: 'udin',
            email: 'udin@gmail.com'
        },
        {
            name: 'jeny',
            email: 'jeny@gmail.com'
        },
        {
            name: 'lura',
            email: 'lura@gmail.com'
        },
    ]);

    // Array
    var users;
    // Get all data
    users = userSheet.find();
    // Get all data which email is 'binsarjr121@gmail.com'
    users = userSheet.find({
        email: {
            equal: 'binsarjr121@gmail.com'
        }
    });
    Logger.log('equal');
    Logger.log(users);

    // Get all data tidak sama dengan 'binsarjr121@gmail.com'
    users = userSheet.find({
        email: {
            not: { equal: 'binsarjr121@gmail.com' }
        }
    });
    Logger.log('not equal');
    Logger.log(users);

    // Get all data yang ada kalimat '%gmail.com'
    Logger.log('like');
    Logger.log(userSheet.find({
        email: {
            like: '%gmail.com'
        }
    }));

    // Get all data yang tidak ada kalimat '%gmail.com'
    Logger.log('not like');
    Logger.log(userSheet.find({
        email: {
            not: {
                like: '%gmail.com'
            }
        }
    }));

    // Get all data dengan limit 2
    users = userSheet.find({
        $limit: 2
    });

    //=============================================================================
    // Object | null
    var user;

    // findOne data asc
    user = userSheet.findOne();

    // findOne data which email is 'binsarjr121@gmail.com'
    user = userSheet.findOne({
        email: 'binsarjr121@gmail.com'
    });

    //=============================================================================
    // update data
    userSheet.update(user._id, {
        email: 'yowiss@gmail.com'
    });
    // delete data dengan kolom email :"yowiss@gmail.com"
    userSheet["delete"]({
        email: 'yowiss@gmail.com'
    });
    // delete all data
    // userSheet.delete()
}

function testDB() {
    var sheetId = '1fqw7NyUXoW7tAeTjpaGqjnm7c804tW8iBKBeE2MZuE8';
    var db = Dbsheet.init(sheetId);
    Logger.log(db.sheetApp.getUrl());
    var columns = ['ok', 'okei', 'sip'];
    db.createSheetIfNotExists('tayo', columns);
    var tayoSheet = db.sheet('tayo');
    tayoSheet.insert([
        {
            ok: 'okasdasd',
            okei: 'asd',
            sip: 'asddd'
        },
        {
            ok: 'yo',
            okei: 'hai hai',
            sip: 'sip'
        },
        {
            ok: 'okasdasd',
            okei: 'asd',
            sip: 'asddd'
        },
        {
            ok: 'asdklmsad',
            okei: 'sqwe',
            sip: 'qwe'
        },
        {
            ok: 'okasdasd',
            okei: 'asd',
            sip: 'asddd'
        },
    ]);
    var tayo = tayoSheet.find();
    Logger.log(tayoSheet.findOne({
        ok: 'yo'
    }));
    tayoSheet["delete"]({
        ok: 'okasdasd'
    });
    tayo = tayoSheet.find();
    var updateTayo = tayo[0];
    tayoSheet.update(updateTayo._id, {
        sip: 'yowiss'
    });
    tayoSheet["delete"]();
}

function testUser2() {
    var db = Dbsheet.init('1fqw7NyUXoW7tAeTjpaGqjnm7c804tW8iBKBeE2MZuE8');
    var userSheet = db.sheet('users');
    //=============================================================================
    var users;
    users = userSheet.find();
    Logger.log('semua data fineOne');
    Logger.log(users);
    // Object | null
    var user;
    // findOne data asc
    user = userSheet.findOne();
    Logger.log('semua data fineOne');
    Logger.log(user);
    // findOne data which email is 'binsarjr121@gmail.com'
    user = userSheet.findOne({
        email: 'udin@gmail.com'
    });
    Logger.log('setelah di cari berdasarkan email');
    Logger.log(user);
    //=============================================================================
    // update data
    userSheet.update(user._id, {
        email: 'emailberubahbukanudin@gmail.com'
    });
    // delete data dengan kolom email :"yowiss@gmail.com"
    // userSheet["delete"]({
    //     email: 'yowiss@gmail.com'
    // });
    // delete all data
    // userSheet["delete"]();
    Logger.log('selesaii gais');
}
