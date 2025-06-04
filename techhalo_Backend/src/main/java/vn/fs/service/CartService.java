package vn.fs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.fs.entity.Cart;
import vn.fs.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart findById(Long cartId) {
        return cartRepository.findById(cartId).orElse(null);
    }

    public void save(Cart cart) {
        cartRepository.save(cart);
    }
}
