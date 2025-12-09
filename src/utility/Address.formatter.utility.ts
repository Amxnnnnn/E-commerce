import { Address } from '@prisma/client'

export const formatAddress = (address: Address): string => {
    return `${address.lineOne}${address.lineTwo ? ', ' + address.lineTwo : ''}, ${address.city}, ${address.country} - ${address.pincode}`
}

export const formatAddressWithComputedField = (address: Address) => {
    return {
        ...address,
        formattedAddress: formatAddress(address)
    }
}