package com.nikkathebrand.backend.config;

import com.nikkathebrand.backend.model.*;
import com.nikkathebrand.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private CollectionRepository collectionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Inicializar Usuario Administrador por Defecto si no existe
        if (adminUserRepository.findByUsername("admin").isEmpty()) {
            AdminUser defaultAdmin = AdminUser.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123")) // Contraseña segura cifrada
                    .email("admin@nikkathebrand.com")
                    .role("ADMIN")
                    .build();
            adminUserRepository.save(defaultAdmin);
            System.out.println("====== DEFAULT ADMIN USER CREATED ======");
            System.out.println("Username: admin");
            System.out.println("Password: admin123 (Crypted)");
            System.out.println("========================================");
        }

        // 2. Inicializar Datos de Ejemplo para el Catálogo si está vacío
        if (productRepository.count() == 0) {
            System.out.println("====== POPULATING INITIAL CATALOG DATA ======");

            // Crear Colección por Defecto
            Collection summerCol = Collection.builder()
                    .name("Summer Vintage 2026")
                    .description("Nuestra colección estrella inspirada en los veranos retro y cómodos.")
                    .products(new ArrayList<>())
                    .build();
            Collection savedCol = collectionRepository.save(summerCol);

            // Producto 1: Bonnie Shift Set
            Product bonnie = Product.builder()
                    .name("BONNIE SHIFT SET - BLUE")
                    .description("Nikka the brand - shift set celeste con bordados de conejito en color blanco. Hecho de 100% algodón orgánico.")
                    .price(new BigDecimal("129.00"))
                    .discountPercentage(0)
                    .category("intimates")
                    .collection(savedCol)
                    .images(new ArrayList<>())
                    .sizes(new ArrayList<>())
                    .build();

            // Agregar imágenes
            List<ProductImage> bonnieImages = List.of(
                    ProductImage.builder().imageUrl("/src/images/pj set/bonnie.png").imageType("MAIN").product(bonnie).build(),
                    ProductImage.builder().imageUrl("/src/images/pj set/Tezza-3399.jpg").imageType("DETAIL").product(bonnie).build()
            );
            bonnie.setImages(bonnieImages);

            // Agregar existencias por talla
            List<SizeInventory> bonnieSizes = List.of(
                    SizeInventory.builder().size("XS").stock(5).product(bonnie).build(),
                    SizeInventory.builder().size("S").stock(10).product(bonnie).build(),
                    SizeInventory.builder().size("M").stock(8).product(bonnie).build(),
                    SizeInventory.builder().size("L").stock(4).product(bonnie).build()
            );
            bonnie.setSizes(bonnieSizes);

            // Producto 2: Duvet Bag
            Product duvetBag = Product.builder()
                    .name("DUVET NIKKA BAG - CRÈME")
                    .description("El bolso acolchado acolchado definitivo en color crema vainilla de textura ultra-mullida.")
                    .price(new BigDecimal("189.00"))
                    .discountPercentage(10) // 10% descuento
                    .category("bags")
                    .collection(savedCol)
                    .images(new ArrayList<>())
                    .sizes(new ArrayList<>())
                    .build();

            List<ProductImage> duvetImages = List.of(
                    ProductImage.builder().imageUrl("/src/images/puffer bag/duvet.JPG").imageType("MAIN").product(duvetBag).build()
            );
            duvetBag.setImages(duvetImages);

            List<SizeInventory> duvetSizes = List.of(
                    SizeInventory.builder().size("XS").stock(0).product(duvetBag).build(), // Sin stock
                    SizeInventory.builder().size("S").stock(15).product(duvetBag).build(),
                    SizeInventory.builder().size("M").stock(20).product(duvetBag).build(),
                    SizeInventory.builder().size("L").stock(15).product(duvetBag).build()
            );
            duvetBag.setSizes(duvetSizes);

            // Guardar en la base de datos
            productRepository.save(bonnie);
            productRepository.save(duvetBag);

            System.out.println("====== CATALOG DATA POPULATED SUCCESSFULLY ======");
        }

        // 3. Inicializar E-Gift Cards si no existen
        if (productRepository.findByCategoryAndActiveTrue("Gift Card").isEmpty()) {
            System.out.println("====== SEEDING E-GIFT CARDS ======");
            Product card50 = Product.builder()
                    .name("E-GIFT CARD $50.000 COP")
                    .description("Las tarjetas de regalo electrónicas (E-gift cards) pueden utilizarse para comprar cualquier artículo en nikka. Estas Gift Cards pueden usarse en cualquier momento y no tienen fecha de vencimiento.")
                    .price(new BigDecimal("15.00"))
                    .discountPercentage(0)
                    .category("Gift Card")
                    .active(true)
                    .images(new ArrayList<>())
                    .sizes(new ArrayList<>())
                    .build();
            card50.setImages(List.of(ProductImage.builder().imageUrl("/src/images/gift-card.webp").imageType("MAIN").product(card50).build()));
            card50.setSizes(List.of(SizeInventory.builder().size("UNI").stock(9999).product(card50).build()));

            Product card80 = Product.builder()
                    .name("E-GIFT CARD $80.000 COP")
                    .description("Las tarjetas de regalo electrónicas (E-gift cards) pueden utilizarse para comprar cualquier artículo en nikka. Estas Gift Cards pueden usarse en cualquier momento y no tienen fecha de vencimiento.")
                    .price(new BigDecimal("25.00"))
                    .discountPercentage(0)
                    .category("Gift Card")
                    .active(true)
                    .images(new ArrayList<>())
                    .sizes(new ArrayList<>())
                    .build();
            card80.setImages(List.of(ProductImage.builder().imageUrl("/src/images/gift-card.webp").imageType("MAIN").product(card80).build()));
            card80.setSizes(List.of(SizeInventory.builder().size("UNI").stock(9999).product(card80).build()));

            Product card150 = Product.builder()
                    .name("E-GIFT CARD $150.000 COP")
                    .description("Las tarjetas de regalo electrónicas (E-gift cards) pueden utilizarse para comprar cualquier artículo en nikka. Estas Gift Cards pueden usarse en cualquier momento y no tienen fecha de vencimiento.")
                    .price(new BigDecimal("45.00"))
                    .discountPercentage(0)
                    .category("Gift Card")
                    .active(true)
                    .images(new ArrayList<>())
                    .sizes(new ArrayList<>())
                    .build();
            card150.setImages(List.of(ProductImage.builder().imageUrl("/src/images/gift-card.webp").imageType("MAIN").product(card150).build()));
            card150.setSizes(List.of(SizeInventory.builder().size("UNI").stock(9999).product(card150).build()));

            productRepository.save(card50);
            productRepository.save(card80);
            productRepository.save(card150);
            System.out.println("====== E-GIFT CARDS SEEDED SUCCESSFULLY ======");
        }
    }
}
