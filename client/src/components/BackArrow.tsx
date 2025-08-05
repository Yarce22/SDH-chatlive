import { useDispatch } from "react-redux"
import { setOpenChat } from "../features/UI/menuSlice"
import backArrow from "../assets/backIcon.png"

const BackArrow = () => {
  const dispatch = useDispatch()

  const handleBackArrow = () => {
    dispatch(setOpenChat(false))
  }

  return (
    <button
      onClick={handleBackArrow}
      className="w-5 h-5"
    >
      <img src={backArrow} alt="back-arrow" />
    </button>
  )
}

export { BackArrow }