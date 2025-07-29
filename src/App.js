import { useState } from 'react';
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

const App = () => {
  const [ShowAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriendForm(false);
  }
  function handleSelectFriend(friend) {
    setSelectedFriend((selected) => selected?.id === friend.id ? null : friend);
    setShowAddFriendForm(false);
  }
  function handleSplit (value){
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend));
    setSelectedFriend(null);
    setShowAddFriendForm(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onSelectFriend={handleSelectFriend} selectedFriend={selectedFriend} />
        {ShowAddFriendForm && <AddFriendForm onAddFriend={handleAddFriend} />}
        <Button onClick={() => setShowAddFriendForm(!ShowAddFriendForm)}>{ShowAddFriendForm ? "Close" : "Add Friend"}</Button>
      </div>
      {selectedFriend && <SplitForm friend={selectedFriend} onSplitBill={handleSplit} />}
    </div>
  );
}

function FriendsList({friends, onSelectFriend , selectedFriend}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend key={friend.id} friend={friend} onSelect={onSelectFriend} selectedFriend={selectedFriend} />
      ))}
    </ul>
  );

}

function Friend({ friend , onSelect , selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={`${isSelected ? "selected" : ""}`}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p >
          You and {friend.name} are even
        </p>
      )}
      <Button onClick={() => onSelect(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  );
}
function Button ({ onClick, children }) {
  return <button className="button" onClick={onClick}>{children}</button>;

}
function AddFriendForm({ onAddFriend }) {
  const [Name, setName] = useState("");
  const [Image, setImage] = useState("https://i.pravatar.cc/48");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = crypto.randomUUID();
    if (!Name || !Image) return;
    const newFriend = {
      id,
      name: Name,
      image: `${Image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return <form className="form-add-friend" onSubmit={handleSubmit}>
    <label>👩🏻‍🤝‍👩🏻 Friend Name</label>
    <input type="text" value={Name} onChange={(e) => setName(e.target.value)} />
    <label>📷 Friend Image URL</label>
    <input type="text" value={Image} onChange={(e) => setImage(e.target.value)} />
    <Button>Add</Button>
  </form>;
}
function SplitForm( { friend , onSplitBill }) {
  const [billValue, setBillValue] = useState('');
  const [payedByUser, setPayedByUser] = useState('');
  const payedByFriend = billValue ? billValue - payedByUser : "";
  const [WhoIsPaying, setWhoIsPaying] = useState("you");
  function handleSubmit(e) {
    e.preventDefault();
    if (!billValue || !payedByUser) return;
    onSplitBill(WhoIsPaying === "you" ? payedByFriend : -payedByUser);

  }
  return <form className="form-split-bill">
    <h2>Split a bill with {friend.name}</h2>
    <label>💰 Bill Value</label>
    <input type="number" placeholder="Enter bill value" value={billValue} onChange={(e) => setBillValue(Number(e.target.value))} />
    <label>👩🏻‍🤝‍👩🏻 Your expense</label>
    <input type="number" placeholder="Enter your expense" value={payedByUser} onChange={(e) => setPayedByUser(Number(e.target.value) > billValue ? payedByUser : Number(e.target.value))} />
    <label>🧑🏻‍🤝‍🧑🏻 Friend's expense</label>
    <input type="number" placeholder="Enter friend's expense" disabled value={payedByFriend} />
    <label>🤑 Who is paying the bill</label>
    <select value={WhoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
      <option value="you">You</option>
      <option value="friend">Friend</option>
    </select>
    <Button onClick={handleSubmit} >Split Bill</Button>
  </form>;
}
export default App;