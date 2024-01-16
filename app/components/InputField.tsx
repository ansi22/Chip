import { useEffect, useRef, useState } from "react";
import { user } from "../types/user";
import { usersList } from "../utils/users";
import Chip from "./Chip";

export default function InputField() {
  const [showUsersList, setShowUsersList] = useState<boolean>(false);
  const [dropDownList, setDropDownList] = useState<user[]>(usersList);
  const [selectedElements, setSelectedElements] = useState<user[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [searchedValue, setSearchedValue] = useState<string>("");
  const inputFieldRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dropdownListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const filteredList = usersList.filter(
      (user) =>
        user.name.toLowerCase().includes(String(searchedValue).toLowerCase()) &&
        !selectedElements.some(
          (selectedUser) => selectedUser.name === user.name
        )
    );
    setDropDownList(filteredList);
  }, [searchedValue]);

  //BackSpaceHandle

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchedValue === "") {
      if (selectedElements.length > 0 && highlightedIndex === null) {
        setHighlightedIndex(selectedElements.length - 1);
      } else if (highlightedIndex !== null) {
        const lastConsecutiveChip = selectedElements[highlightedIndex];
        setDropDownList([...dropDownList, lastConsecutiveChip]);
        setSelectedElements((prevSelectedElements) =>
          prevSelectedElements.filter((_, index) => index !== highlightedIndex)
        );
        setHighlightedIndex(null);
      }
    }
  };

  //MouseOut handle
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (
        inputFieldRef.current &&
        containerRef.current &&
        dropdownListRef.current &&
        !(
          inputFieldRef.current.contains(e.target as Node) ||
          containerRef.current.contains(e.target as Node) ||
          dropdownListRef.current.contains(e.target as Node)
        )
      ) {
        setShowUsersList(false);
      }
    };
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col mt-[100px] items-center h-screen w-full ">
      <p className="text-purple-900 font-semibold text-base p-4">Search</p>
      {/* searchInput */}
      <div
        className="rounded-full flex flex-row gap-4 items-center w-[50%] bg-[white] pl-[15px] h-[70px] cursor-pointer border-2 hover:border-[#5d1179] overflow-x-auto"
        ref={containerRef}
      >
        {selectedElements.length > 0 &&
          selectedElements.map((selectedElement: user, index: number) => (
            <div
              key={selectedElement.name}
              onClick={() => {
                setDropDownList([...dropDownList, selectedElement]);
                setSelectedElements(
                  selectedElements.filter((x) => x !== selectedElement)
                );
                if (inputFieldRef.current) {
                  inputFieldRef.current.focus();
                }
              }}
            >
              <Chip
                isHighlighted={index === highlightedIndex}
                name={selectedElement.name}
                img={selectedElement.img}
              />
            </div>
          ))}

        <input
          ref={inputFieldRef}
          type="text"
          className={`${
            !selectedElements.length && "ml-[35px]"
          } outline-none border-none w-[93%] cursor-pointer h-full`}
          onClick={() => setShowUsersList(true)}
          value={searchedValue}
          onChange={(e) => setSearchedValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* dropdownlist */}
      {showUsersList && (
        <div
          className="flex flex-col w-[46%] max-h-[50%] min-h-fit bg-white overflow-y-auto"
          ref={dropdownListRef}
        >
          {dropDownList.map((user: user) => (
            <div
              key={user.name}
              className="p-4 cursor-pointer hover:bg-gray-100 flex flex-row items-center gap-8"
              onClick={() => {
                setSelectedElements([...selectedElements, user]);
                setDropDownList(dropDownList.filter((x) => x !== user));
                setSearchedValue("");
                setHighlightedIndex(null);
              }}
            >
              <img
                src={user.img}
                alt="profile"
                className="w-12 h-12 rounded-full"
              />
              <p className="text-base text-stone-900">{user.name}</p>
              <p className="text-sm text-stone-400">{user.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
