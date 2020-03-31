import React, {Component} from 'react'
import Dexie from 'dexie';

var db
export default class DbPage extends Component{

    _onClick() {
        db = new Dexie("FriendDatabase");
        if (!db) return 
        let Version = db.version(1)
        let Stores = Version.stores({ friends: "++id,name,age" });
        
        db.transaction('rw', db.friends, async() => {
        
            // Make sure we have something in DB:
            if ((await db.friends.where('name').equals('Josephine').count()) === 0) {
                let id = await db.friends.add({name: "Josephine", age: 21});
                alert (`Addded friend with id ${id}`);
            }
        
            // Query:
            let youngFriends = await db.friends.where("age").below(25).toArray();
        
            // Show result:
            alert ("My young friends: " + JSON.stringify(youngFriends));
        
        }).catch(e => {
            alert(e.stack || e);
        });
        db.transaction('rw', db.friends, async() => {
            let id = await db.friends.add({name: "james", age: 22});
        }).catch(e => {
            alert(e.stack || e);
        });
        console.log('准备初始化db')
    }

    render(){
        return (
            <div>
                <button onClick={()=>this._onClick()}>初始化db:</button>
            </div>
        )
    }
}
