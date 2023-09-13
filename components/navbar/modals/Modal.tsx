'use client';

import Button from "@components/Button";
import React, { useCallback, useEffect, useState } from "react";
import {IoMdClose} from "react-icons/io";


//For demo purposes and for login functionality
interface ModalProps{
    isOpen?: boolean;
    onClose:()=>void;
    onSubmit:()=> void;
    //this means the title is optional (Tile is either Login or Register)
    title?:string;
    body?:React.ReactElement;
    footer?:React.ReactElement;
    //ActionLabel is required String
    actionLabel:string;
    disabled?:boolean;
    secondaryAction?:()=>void;
    secondaryActionLabel?:string;

}


const Model:React.FC<ModalProps>=({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction, //Previous and next button
    secondaryActionLabel
})=>{



    //Use some modal

    const [showModal, setshowModal] =useState(isOpen);


    //use useEffect to change the value of the modal

    useEffect(() =>{
        setshowModal(isOpen);
    },[isOpen]);

    const handleClose = useCallback(()=>{
        //check if the modal is disabled if it is then do nothing
        if(disabled){
            return;
        }

        setshowModal(false);
        //To show some animations
        setTimeout(() => {
            onClose();
        }, 300);
    },[disabled,onClose])



    const handleSubmit = useCallback(()=>{
        //check if the modal is disabled if it is then do nothing
        if(disabled){
            return;
        }
        onSubmit(); 
    },[disabled,onSubmit])

    const handleSecondaryAction = useCallback(()=>{
        //check if the modal is disabled or any secodnary action is there or not
        //if it is then do nothing
        //else execute secondary action
        if(disabled || !secondaryAction){
            return;
        }

        secondaryAction();

    },[disabled,secondaryAction]);


    if(!isOpen){
        return null;
    }


    return(
        <>
           <div className="justify-center items-center flex overflow-x-hidden overflow-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
                <div className="relative w-full md:w-1/3 xl:2/5 mx-auto max-h-screen
                md:h-auto">
                    {/**Content */}
                    {/** This div is conditional div */}
                    <div 
                        className={`
                        translate duration-300 max-h-screen
                        ${showModal?'translate-y-0':'translate-y-full'}
                        ${showModal?'opacity-100':'opacity-0'}
                        `}>
                        <div className="translate h-full md:h-auto border-0
                        rounded-lg shadow-lg relative flex flex-col
                         bg-zinc-100 outline-none focus:outline-none">
                            {/**Header for login or register */}
                            <div className="flex items-center p-4 rounded-sm justify-center relative  border-b-[1px]">
                                <button 
                                onClick={handleClose}
                                className="border-0 hover:opacity-70 transition absolute right-5">
                                    <IoMdClose size={18}></IoMdClose>
                                </button>
                                <div className="text-lg font-bold">
                                    {title}
                                </div>
                            </div>
                            {/**Body of the Login Page */}
                            <div className="relative p-3">
                                {body}
                            </div>
                            {/**For Fotter */}
                            <div className="flex flex-col p-4 gap-1 md:gap-2">
                                <div className="flex flex-row items-center gap-2 w-full">
                                    {/**This is our primary action Button */}
                                    {secondaryAction && secondaryActionLabel&&(
                                            <Button outline
                                            disabled={disabled}
                                            label={secondaryActionLabel}
                                            onClick={handleSecondaryAction}/>
                                        )}
                                    <Button disabled={disabled}
                                        label={actionLabel}
                                        onClick={handleSubmit}/>
                                        {/**This is boolean conditional rendering of the secondary action, if secondary actions exists then only it is render */}
                                        
                                
                                </div>
                                {footer}
                            </div>
                        </div>
                    </div>
                </div>
           </div>
        </>
    )
}

export default Model;