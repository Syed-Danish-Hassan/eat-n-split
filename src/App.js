import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setshowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setshowAddFriend(!showAddFriend);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...initialFriends, friend]);
    setshowAddFriend(false);
  }
  function handleSelection(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    //setSelectedFriend(friend);
    setshowAddFriend(false);
  }
  function handleSplitBill(value) {
    console.log(value + "-");
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        ></FriendsList>
        {showAddFriend && (
          <FormAddFriend onAddFriend={handleAddFriend}></FormAddFriend>
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSubmitSplitBill={handleSplitBill}
          key={selectedFriend.id}
        ></FormSplitBill>
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  //const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        ></Friend>
      ))}
    </ul>
  );

  function Friend({ friend, onSelection, selectedFriend }) {
    const isSelected = selectedFriend?.id === friend.id;
    return (
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.name} alt={friend.name}></img>
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}
            {"$"}
          </p>
        )}

        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you {friend.balance}
            {"$"}
          </p>
        )}
        {friend.balance === 0 && (
          <p className="black">you and {friend.name} are even</p>
        )}
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    );
  }
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");
  function handleSubmit(e) {
    if (!name || !image) return;
    const ids = crypto.randomUUID();
    e.preventDefault();
    const newFriend = {
      id: ids,
      name,
      image: `${image}?=${ids}`,
      balance: 0,
    };
    console.log(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
    onAddFriend(newFriend);
  }
  return (
    <form className="friend-add-friend" onSubmit={handleSubmit}>
      <label>👭 Friend name</label>
      <input type="text" onChange={(e) => setName(e.target.value)}></input>
      <label> 🏘 Image URL</label>
      <input
        type="text"
        onChange={(e) => setImage(e.target.value)}
        value={image}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSubmitSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("You");
  const paidByFriend = bill ? bill - paidByUser : "";
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    console.log(whoIsPaying);
    onSubmitSplitBill(whoIsPaying === "You" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL {selectedFriend.name}</h2>
      <label> 💰Bill Values</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>

      <label> 👩🏻‍🤝‍🧑🏻Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      ></input>

      <label> 🧞‍♂️ {selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend}></input>

      <label>😀Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => {
          setWhoIsPaying(e.target.value);
          console.log("Value is " + e.target.value);
        }}
      >
        <option value="You">You</option>
        <option value="Friend">Friend</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
