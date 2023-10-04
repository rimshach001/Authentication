import { View, Text } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as Contacts from 'expo-contacts'
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import AlphabetList from './AlphabetList';
import { SectionList } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native';
const ContactList = () => {
  const [contacts, setcontacts] = useState([])
  const [selectedcontacts, SetSelectedcontacts] = useState([])
  const [searchText, setSearchText] = useState(''); // State for search input
  const [searchedData, setSearchedData] = useState(false)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const sectionListRef = useRef(null); // Create a ref for the FlatList
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          // fields: [Contacts.Fields.Emails],
          sort: Contacts.SortTypes.FirstName
        });

        if (data.length > 0) {
          const contact = data[0];
          setcontacts(data)
          // console.log(contact);
          setLoading(false)
        }
      }
    })();
  }, [currentSectionIndex,currentSectionIndex]);
  const pressContact = (item) => {
    console.log(item, "pppp")
    if (item.phoneNumbers && item.phoneNumbers.length > 0) {
      const phoneNumber = item.phoneNumbers[0].number;
      if (phoneNumber && typeof phoneNumber === 'string') {
        console.log(phoneNumber);
        Alert.alert(`Call to ${item.firstName} `, phoneNumber);
      } else {
        console.log('Phone number not available.');
      }
    } else {
      console.log('Phone number not available.');
    }
  }
  const alphabetLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  // const handleLetterPress = (letter) => {
  //   const sectionIndex = contacts.findIndex((contact) =>
  //   contact.firstName.charAt(0).toUpperCase() === letter
  // );

  //   setCurrentSectionIndex(sectionIndex);
  //   console.log("Index:",currentSectionIndex,"--details--" ,contacts[currentSectionIndex].firstName);
  //   if (sectionIndex !== -1 && sectionListRef.current) {
  //     sectionListRef?.current?.scrollToLocation({
  //       sectionIndex: 0,
  //       itemIndex: currentSectionIndex,
  //     });
  //   }
  //   else{
  //     (Alert.alert(`There is no contact with ${letter} letter`))
  //   }
  // };
  const handleLetterPress = (letter) => {
    const sectionIndex = organizedContacts.findIndex((section) =>
      section.title === letter,
      );
      console.log(sectionIndex,"letterIndex", organizedContacts[sectionIndex].title)

    setCurrentSectionIndex(sectionIndex);
    console.log("Index:", sectionIndex, "--details--", organizedContacts[sectionIndex].title);
    if (sectionIndex !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex,
        itemIndex: sectionIndex+1,
      });
    } else {
      Alert.alert(`There is no contact with ${letter} letter`);
    }
  };
  // const handleLetterPress = (letter) => {
  //   const sectionIndex = organizedContacts.findIndex((section) =>
  //     section.title === letter,
  //   );
  
  //   if (sectionIndex !== -1 && sectionListRef.current) {
  //     // Check if sectionIndex is within the valid range
  //     if (sectionIndex >= 0 && sectionIndex < organizedContacts.length) {
  //       sectionListRef.current.scrollToLocation({
  //         sectionIndex,
  //         itemIndex: 0, // Scroll to the first item in the section
  //       });
  //     } else {
  //       Alert.alert(`Invalid section index: ${sectionIndex}`);
  //     }
  //   } else {
  //     Alert.alert(`There is no contact with ${letter} letter`);
  //   }
  // };
  



  // const organizedContacts = useMemo(() => {
  //   const organized = {};
  //   for (const contact of contacts) {
  //     const firstLetter = contact.firstName.charAt(0).toUpperCase();

  //     if (!organized[firstLetter]) {
  //       organized[firstLetter] = [];
  //     }

  //     organized[firstLetter].push(contact);
  //   }

  //   const sections = Object.entries(organized).map(([title, data]) => ({
  //     title,
  //     data,
  //   }));
  //   sections.sort((a, b) => a.title.localeCompare(b.title));
  //   return sections;
  // }, [contacts]);

  const organizedContacts = useMemo(() => {
    const organized = Object.fromEntries(
      alphabetLetters.map((letter) => [letter, []])
    );

    for (const contact of contacts) {
      const firstLetter = contact.firstName.charAt(0).toUpperCase();
      organized[firstLetter].push(contact);
    }
    const sections = Object.entries(organized).map(([title, data]) => ({
      title,
      data,
    }));
    sections.sort((a, b) => a.title.localeCompare(b.title));

    return sections;
  }, [contacts, alphabetLetters]);


  const filterContacts = (input) => {
    if(input===''){
      setSearchedData(false)
      console.log("-ifff-", searchedData, input)
    }
    else{
      console.log("-elsee--");
      setSearchedData(true)
      // setcontacts(contacts)
      console.log("-----------------", input, "inputtt-----------------------");
      const filteredContacts = contacts?.filter((contact) => {
        // const fullName = `${contact.firstName}`.toLowerCase();
        const SearchData = contact.firstName.toLowerCase().includes(input.toLowerCase());
        // console.log(SearchData,"---0000000----");
        return SearchData
      });
      SetSelectedcontacts(filteredContacts)
    }
    setSearchText(input);
  };
  const updateSearch = (text) => {
    setSearchText(text);
    // setcontacts(contacts)
    if (text === '') {
      setcontacts(contacts);
    } else {
      console.log(text, "0000");
      const filteredContacts = filterContacts(text);
      setcontacts(filteredContacts);
    }
  };

  return (
    <View style={{ marginVertical: 60, marginHorizontal: 30 }}>
      <TextInput
        placeholder="Search contacts"
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
          marginTop: 50
        }}
        onChangeText={filterContacts}
        value={searchText}
      />
      <Text style={{ fontSize: 30, marginLeft: 60, color: 'white' }}>My Contact List</Text>
      {loading ? (
        <ActivityIndicator size="large" color="white" />
      ) : (
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {searchedData ?
            (<FlatList
              data={selectedcontacts}
              renderItem={({ item }) => {
                return (
                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 40, paddingTop: 9 }}>
                    <View style={{ flex: 0.8 }}>
                      <TouchableOpacity onPress={() => pressContact(item)}>
                        <Text style={{ fontSize: 17, color: 'white', fontWeight: '500' }}>{item.firstName}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }}
            />) :
            (
              <SectionList
                ref={sectionListRef}
                // data={contacts}
                sections={organizedContacts}
                renderItem={({ item }) => {
                  return (
                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 40, paddingTop: 9 }}>
                      <View style={{ flex: 0.8 }}>
                        <TouchableOpacity onPress={() => pressContact(item)}>
                          <Text style={{ fontSize: 17, color: 'white', fontWeight: '500' }}>{item.firstName}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                }}
                renderSectionHeader={({ section: { title } }) => {
                  // Check if there are contacts in the section
                  const sectionData = organizedContacts.find((sectionData) => sectionData.title === title);
                  if (sectionData && sectionData.data.length > 0) {
                    return (
                      <Text style={{ backgroundColor: 'black', fontSize: 20, fontWeight: 'bold', color: 'white', borderBottomWidth: 1, borderBottomColor: 'grey' }}>
                        {title}
                      </Text>
                    );
                  }
                  // Return null for sections with no contacts
                  return null;
                }}
              />
            )
          }

          <AlphabetList letters={alphabetLetters} onLetterPress={handleLetterPress} />
        </View>
      )
      }
    </View>
  )
}

export default ContactList