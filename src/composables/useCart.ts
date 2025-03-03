import { computed } from "@vue/reactivity"
import {nextTick, ref} from "vue"

const cart = ref({
  items: [] as CartItem[],
})

export const useCart = () => {
  const addToCart = async (product: Product) => {
    const item = cart.value.items.find(item => item.productId === product.id)
    if(item) {
      updateQuantity(item, item.quantity + 1)
    } else {
      cart.value.items.push({
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
      })
    }

  }

  const updateQuantity =  async (item: CartItem, quantity: number) => {
        item.quantity = quantity
  }

  const reduceCart =  async (item: CartItem, quantity: number) => {
    if (quantity <= 0){
      if (confirm('是否要移除购物车')) {
        removeFromCart(item)
      }else {
        await nextTick()
        updateQuantity(item,item.quantity + 1)
      }
    }
  }


  const removeFromCart = async (item: CartItem) => {
    const index = cart.value.items.findIndex(cartItem => cartItem.productId === item.productId)
    if(index > -1) {
      cart.value.items.splice(index, 1)
    }
  }

  const totalProducts = computed(() => {
    return cart.value.items.reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
  })

  const isCartEmpty = computed(() => {
    return cart.value.items.length === 0
  })

  return {
    cart,
    addToCart,
    totalProducts,
    updateQuantity,
    removeFromCart,
    isCartEmpty,
    reduceCart
  }
}
