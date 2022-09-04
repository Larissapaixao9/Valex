import * as cardRepository from '../repositories/cardRepository'
import * as rechargesRepository from '../repositories/rechargesRepository'
import * as paymentsRepository from '../repositories/paymentsRepository'
import * as companyRepository from '../repositories/companyRepository'
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { mapObjectToUpdateQuery } from '../../valex/utils/sqlUtils';


export async function validatecardtype(typeofcard:string){
    if(typeofcard!='health' && typeofcard!='groceries' && typeofcard!='restaurants' && typeofcard!='transport' && typeofcard!='education' && typeofcard!='health' ){
        return 0;
    }
    else return 1;
}


export async function getEmployee(id:number,typeofcard:string){
    const employeeRowCount =  await cardRepository.findEmployees(id,typeofcard);
    console.log(employeeRowCount);
    if(employeeRowCount==0){
        throw Error('Funcionário não existe')
    }
    else{
        console.log(`tipo do cartão ${typeofcard} e id=${id}`)
        VerifyDuplicateCardType(id,typeofcard)
    }
}

export async function VerifyDuplicateCardType(id:number,typeofcard:string){
    const findExistingCardType = await cardRepository.findDuplicateCardType(id,typeofcard);
    console.log(findExistingCardType);
    console.log(typeofcard)
    if(findExistingCardType.rowCount!=0){
        throw Error('Funcionário já possui um cartão desse tipo')
    }
    else{
        let cardNumber = Number(faker.random.numeric(10));
        let cvc = faker.random.numeric(3);
        const Cryptr = new cryptr('myTotallySecretKey');
        const encriptedCvc = Cryptr.encrypt(cvc);
        console.log(encriptedCvc)
        console.log(cvc)
        console.log(cardNumber)
        const employeeName = await cardRepository.getEmployeeName(id);
        console.log(employeeName)
        console.log('sucesso. Cartao pode ser criado')

        const { fullName } = employeeName;
        const CardEmployeeNameFormatted = generateEmployeeCardName(fullName);
        console.log(CardEmployeeNameFormatted)
        const date = generateDateFiveYearsFromNow()
        const formatedDate = dayjs(date).format('MM/YY')
        console.log(formatedDate)

        const isCardgenerated = await cardRepository.createCardforEmployee(id,CardEmployeeNameFormatted,cardNumber,encriptedCvc,formatedDate,typeofcard)

        if(isCardgenerated==true){
            console.log('cartão gerado')
            return { cvc, CardEmployeeNameFormatted }
        }
        else{
            throw Error('não foi possivel criar cartão')
        }

        //function to generate the name for the card (formatted)
        function generateEmployeeCardName(name:string) {
            let nameArray = name.split(' ');
            let cardFinalName = ''
            let firstName = nameArray[0];
            let lastName = nameArray[nameArray.length - 1];
          
            let middleName = nameArray.filter((item) => item != firstName && item != lastName)
          
            let filteredMiddleName = middleName.filter((item) => item != 'da');
          
            let middleNameLetters = [];
            for (let i = 0; i < filteredMiddleName.length; i++) {
              middleNameLetters.push(filteredMiddleName[i].charAt(0))
            }
          
            if (name.length < 3) {
                cardFinalName = name[0] + ' ' + name[1]
              }
              else {
                cardFinalName = firstName + ' ' + middleNameLetters.join(' ') + ' ' + lastName
              }  
              return cardFinalName.toUpperCase();
          }

          function generateDateFiveYearsFromNow(){
            const fiveYearFromNow = new Date();
            return fiveYearFromNow.setFullYear(fiveYearFromNow.getFullYear() + 5);
          }
    }
}

export async function findCard(id:number,cvc:any) {
    const isCardId = await cardRepository.verifyCardId(id);
    if(isCardId==0){
        throw Error('cartão inexistente');
    }
    const userCvc = await cardRepository.findcvc(id);

     const Cryptr = new cryptr('myTotallySecretKey');
         const uncriptedCvc = Cryptr.decrypt(userCvc.securityCode)
         console.log(`esse é o cvc decriptado ${uncriptedCvc}`)


        if(uncriptedCvc!=cvc){
            throw Error('numero de CVC informado incorreto')
        }

        
    const cardRowCount = await cardRepository.findCardByIdandCvc(id,userCvc.securityCode);
    if(cardRowCount==0){
        throw Error('não foi possivel desbloquear cartão pois esse cartão não existe')
    } 

        const expirationDate = await cardRepository.findExpirationCard(id,userCvc.securityCode);
        console.log(expirationDate)
        
        const expiredData = expirationDate.expirationDate.split('/');
        let formatExpiredData: string = '';
        if(+expiredData[0]<10){
            formatExpiredData = dayjs(`01/0${+expiredData[0]+1}/${expiredData[1]}`).format()
        }
        else if(+expiredData[0] >= 10 && +expiredData[0] < 12){
            formatExpiredData = dayjs(`01/${+expiredData[0]+1}/${expiredData[1]}`).format();
        }
        else{
            formatExpiredData = dayjs(`01/01/${+expiredData[1]+1}`).format();
        }

        const isCardExpired = dayjs().isAfter(formatExpiredData);
        if(isCardExpired){
            throw Error('Card is expired')
        }

        const isPassword = await cardRepository.getPassword(id);
        if(isPassword.password!=null){
            throw Error('Cartão já possui senha, logo já está ativado')
        }
        if(isPassword.password==null){
            const newPassword = generatePassword();
            unlockEmployeeCard(id,newPassword);
            return newPassword;
        }

        function generatePassword(){
            const newPassword = faker.random.numeric(4);
            console.log(`a senha gerada é ${newPassword}`);

            //encripta senha:
            const CryptPassword = bcrypt.hashSync(newPassword, 10);
            console.log(CryptPassword)
            return CryptPassword;
        }
        async function unlockEmployeeCard(id:number, newPassword:string){
            const isUnlocked = await cardRepository.unlockCard(id,newPassword);
            if(isUnlocked){
                console.log('senha gerada com sucesso')
                return userCvc
            }
        }
    
}

export async function getTransactions(id:number){
    const isCardId = await cardRepository.verifyCardId(id);
    if(isCardId==0){
        throw Error('cartão inexistente');
    }
    const isPassword = await cardRepository.getPassword(id);
    if(isPassword.password==null){
        throw Error('Cartão ainda não foi ativado, logo não podemos visualizar seus dados')
    }
    const transactions = await cardRepository.getTransactions(id);
    console.log(transactions)
    return transactions;
}

export async function getRechargesData(id:number) {
    const rechargeData = await rechargesRepository.getRechargesbyCardbyid(id);
    let recharges_amount:number = 0;
    rechargeData?.map(recharge=>{
        recharges_amount +=recharge.amount
    })
    return {rechargeData,recharges_amount};
}
export async function getPaymentsData(id:number) {
    const payments = await paymentsRepository.getPaymentsAndBusinessNameBycardId(id);
    let payments_amount = 0;
    payments?.map(payment=>{
        payments_amount+=payment.amount
    })
    return { payments, payments_amount }
}

export async function verifyCard(id:number){
    const isCardId = await cardRepository.verifyCardId(id);
    if(isCardId==0){
        throw Error('cartão inexistente');
    }
}

export async function verifyExpiredCard(id:number) {
    const expirationDate = await cardRepository.isCardExpired(id);
    const expiredData = expirationDate.expirationDate.split('/');
        let formatExpiredData: string = '';
        if(+expiredData[0]<10){
            formatExpiredData = dayjs(`01/0${+expiredData[0]+1}/${expiredData[1]}`).format()
        }
        else if(+expiredData[0] >= 10 && +expiredData[0] < 12){
            formatExpiredData = dayjs(`01/${+expiredData[0]+1}/${expiredData[1]}`).format();
        }
        else{
            formatExpiredData = dayjs(`01/01/${+expiredData[1]+1}`).format();
        }

        const isCardExpired = dayjs().isAfter(formatExpiredData);
        if(isCardExpired){
            throw Error('Card is expired')
        }
}

export async function isCardLocked(id:number){
    const cardStatus = await cardRepository.getBlockedandUnblockedCard(id);
    if(cardStatus.isBlocked==true){
        throw Error('o cartão está bloqueado')
    }
}

export async function verifyPassword(id:number,password:any){
    const getPassword = await cardRepository.getPassword(id);
    console.log(getPassword) 
    const verifyPassword=bcrypt.compareSync(password, getPassword.password)
    console.log(verifyPassword)
    if(verifyPassword==false){
        throw Error('senha incorreta')
    }
    return getPassword;
}

export async function blockCard(id:number,password:any){
    const isBlocked = await cardRepository.blockCardByid(id,password);
    console.log(isBlocked);
    return isBlocked;
}

export async function isCardUnlocked(id:number){
    const cardStatus = await cardRepository.getBlockedandUnblockedCard(id);
    if(cardStatus.isBlocked==false){
        throw Error('o cartão já está desbloqueado, logo não podemos realizar o desbloqueio')
    }
}

export async function unblocktheCard(id:number,password:any){
    const blocking = await cardRepository.unlocktheCard(id,password)
}
