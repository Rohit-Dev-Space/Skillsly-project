import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Check, X } from 'lucide-react';
import axiosinstance from '../Utilities/axiosIntance';
import { UserContext } from '../Componet/Context/UserContext';
import { Toaster } from 'sonner';
import { toast } from "sonner"

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer w-full">
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
  func
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleItemMouseEnter = useCallback(index => {
    setSelectedIndex(index);
  }, []);

  const handleItemClick = useCallback((item, index) => {
    setSelectedIndex(index);
    if (onItemSelect) {
      onItemSelect(item, index);
    }
  }, [onItemSelect]);

  const handleScroll = useCallback(e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = e => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  const { user } = useContext(UserContext)

  const handleCreateGroup = async (item) => {
    try {
      const response = await axiosinstance.post('/groups/create-group', { title: `${item.senderId.userName} & ${user.userName} Group`, memberOne: item.senderId._id, memberTwo: user._id, memberOneSkill: item.skillOffering, memberTwoSkill: item.category, createdBy: item.senderId._id });
      if (response.data.group) {
        func(item._id);
        toast.success('Group Created Successfully!', { duration: 4000 });
      }
    } catch (err) {
      console.error("Error creating group:", err);
    }
  }

  return (
    <div className={`relative w-full -mt-5 ${className}`}>
      <Toaster position="top-right" richColors />
      <div
        ref={listRef}
        className={`max-h-[400px] overflow-y-auto p-4 ${displayScrollbar
          ? '[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#403f42] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]'
          : 'scrollbar-hide'
          }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: '#222 #060010'
        }}>
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}>
            <div
              className={`p-4 bg-[#111] flex justify-between rounded-lg ${selectedIndex === index ? 'bg-[#222]' : ''} ${itemClassName}`}>
              <div className='flex gap-2 items-center'>
                <div className='w-7 h-7 rounded-full object-cover'>
                  <img src={item.senderId.profileImageUrl} alt="" className='w-7 h-7 rounded-full object-cover' />
                </div>
                <p className="text-white font-semibold m-0">{item.senderId.userName}</p>
              </div>
              <p className='text-sm w-[30ch] text-center text-gray-300'>{item.title}</p>
              <div className='flex gap-5'>
                <button
                  onClick={() => handleCreateGroup(item)}
                  className="p-1 rounded-full cursor-pointer hover:bg-black/50 hover:text-teal-400 transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>

                <button
                  onClick={() => { func(item._id) }}
                  className="p-1 rounded-full cursor-pointer hover:bg-black/50 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-[#060010] to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
