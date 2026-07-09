import express, { Response } from "express";
import { 
  readLocalDB, 
  writeLocalDB, 
  isProductionDB, 
  getPrisma 
} from "./db";
import { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  requireAuth, 
  requireRole, 
  AuthenticatedRequest 
} from "./auth";
import { 
  sendEmail, 
  getWelcomeEmail, 
  getVerifyEmail, 
  getPasswordResetEmail, 
  getOrderConfirmationEmail, 
  getOrderShippedEmail, 
  getOrderDeliveredEmail, 
  getNewMessageEmail, 
  getNewFollowerEmail, 
  getReviewReminderEmail 
} from "./email";

const router = express.Router();

// HELPER: Generate simple unique IDs for Mock mode
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// Rate Limiting Scaffolding Ready (Can be plugged into redis or express-rate-limit)
const rateLimitMap = new Map<string, number[]>();
const rateLimitMiddleware = (req: any, res: Response, next: any) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const limit = 100; // max requests per window

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip)!;
  const activeTimestamps = timestamps.filter(t => now - t < windowMs);
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);

  if (activeTimestamps.length > limit) {
    return res.status(429).json({ error: "Too many workshop transmissions. Take a breath and try again later." });
  }
  next();
};

router.use(rateLimitMiddleware);

// ==========================================
// 1. AUTHENTICATION API
// ==========================================

router.post("/auth/signup", async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All signature parameters (email, password, name) are required." });
  }

  try {
    const pRole = role === "CREATOR" ? "CREATOR" : "USER";
    const hashedPassword = await hashPassword(password);
    const verificationToken = generateId("verify");

    if (isProductionDB) {
      const prisma = getPrisma();
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email signature already registered inside Artora archives." });
      }

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          name,
          role: pRole,
          verificationToken,
          isVerified: false,
        }
      });

      // If user is creator, create empty creator profile
      if (pRole === "CREATOR") {
        await prisma.creatorProfile.create({
          data: {
            userId: user.id,
            name: user.name,
            specialty: "Sovereign Artisan",
            country: "Global Guild",
            storyText: "A new creator committed to physical tactile preservation.",
            inspiration: "Nature and ancient heritage.",
            materials: ["Local clay", "Charcoal"],
            productionTime: "Variable",
            craftProcess: "Handmoulded and slow-baked",
            badgeLevel: "NEW_CREATOR"
          }
        });
      }

      // Dispatch welcome & verification emails
      await sendEmail(email, "Welcome to the Artora Guild", getWelcomeEmail(name));
      await sendEmail(email, "Verify Your Artora Signature", getVerifyEmail(name, verificationToken));

      const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
      const refreshToken = generateRefreshToken({ userId: user.id });

      return res.status(201).json({ message: "Initiation successful.", accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified } });
    } else {
      // Mock local JSON DB Mode
      const db = readLocalDB();
      if (db.users.find((u: any) => u.email === email)) {
        return res.status(400).json({ error: "Email signature already registered inside Artora archives." });
      }

      const userId = generateId("usr");
      const newUser = {
        id: userId,
        email,
        passwordHash: hashedPassword,
        name,
        role: pRole,
        isVerified: false,
        verificationToken,
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);

      if (pRole === "CREATOR") {
        db.creatorProfiles.push({
          id: generateId("creator"),
          userId: userId,
          name,
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
          specialty: "Sovereign Artisan",
          rating: 5.0,
          ratingCount: 0,
          followersCount: 0,
          followingCount: 0,
          sales: 0,
          country: "Global Guild",
          storyText: "A new creator committed to physical tactile preservation.",
          inspiration: "Nature and ancient heritage.",
          materials: ["Local clay", "Charcoal"],
          productionTime: "Variable",
          craftProcess: "Handmoulded and slow-baked",
          joinedAt: new Date().toISOString(),
          badgeLevel: "NEW_CREATOR"
        });
      }

      writeLocalDB(db);

      await sendEmail(email, "Welcome to the Artora Guild", getWelcomeEmail(name));
      await sendEmail(email, "Verify Your Artora Signature", getVerifyEmail(name, verificationToken));

      const accessToken = generateAccessToken({ userId, email, role: pRole, name });
      const refreshToken = generateRefreshToken({ userId });

      return res.status(201).json({
        message: "Initiation successful.",
        accessToken,
        refreshToken,
        user: { id: userId, email, name, role: pRole, isVerified: false }
      });
    }
  } catch (err: any) {
    return res.status(500).json({ error: "Internal Auth processing failure: " + err.message });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Credentials must contain email and password signatures." });
  }

  try {
    let user: any = null;

    if (isProductionDB) {
      user = await getPrisma().user.findUnique({ where: { email } });
    } else {
      user = readLocalDB().users.find((u: any) => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ error: "Guild records do not contain this credential signature." });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid password key signature." });
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
    const refreshToken = generateRefreshToken({ userId: user.id });

    return res.json({
      message: "Guild clearance verified.",
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isVerified: user.isVerified }
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Auth verification crash: " + err.message });
  }
});

router.post("/auth/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is mandatory." });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(401).json({ error: "Expired or corrupt refresh signature." });
  }

  try {
    let user: any = null;
    if (isProductionDB) {
      user = await getPrisma().user.findUnique({ where: { id: payload.userId } });
    } else {
      user = readLocalDB().users.find((u: any) => u.id === payload.userId);
    }

    if (!user) {
      return res.status(404).json({ error: "Associated guild entity no longer exists." });
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
    return res.json({ accessToken });
  } catch (err: any) {
    return res.status(500).json({ error: "Token refresh failure: " + err.message });
  }
});

router.get("/auth/verify", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send("Verification signature is missing.");
  }

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const user = await prisma.user.findFirst({ where: { verificationToken: token as string } });
      if (!user) return res.status(400).send("Verification token invalid or previously burned.");

      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, verificationToken: null }
      });
    } else {
      const db = readLocalDB();
      const user = db.users.find((u: any) => u.verificationToken === token);
      if (!user) return res.status(400).send("Verification token invalid or previously burned.");

      user.isVerified = true;
      user.verificationToken = null;
      writeLocalDB(db);
    }

    return res.send(`
      <div style="background-color: #111111; color: #F8F8F6; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border-top: 4px solid #C9A227;">
        <h1 style="color: #C9A227; font-size: 32px; font-weight: 300; letter-spacing: 0.1em; margin-bottom: 8px;">SIGNATURE VERIFIED</h1>
        <p style="color: #F8F8F6; opacity: 0.7; max-width: 400px; line-height: 1.6; font-size: 14px;">Your physical member verification has been successfully locked on chain. You may now return to the Artora app.</p>
        <a href="/" style="margin-top: 24px; display: inline-block; background-color: #C9A227; color: #111111; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">Return to Artora</a>
      </div>
    `);
  } catch (err: any) {
    return res.status(500).send("Verification processing crash: " + err.message);
  }
});

router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Target email required." });

  try {
    let user: any = null;
    const token = generateId("reset");

    if (isProductionDB) {
      const prisma = getPrisma();
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { resetToken: token, resetTokenExpires: new Date(Date.now() + 3600000) } // 1 hour
        });
      }
    } else {
      const db = readLocalDB();
      user = db.users.find((u: any) => u.email === email);
      if (user) {
        user.resetToken = token;
        user.resetTokenExpires = new Date(Date.now() + 3600000).toISOString();
        writeLocalDB(db);
      }
    }

    if (user) {
      await sendEmail(email, "Reset Your Artora Credentials", getPasswordResetEmail(user.name, token));
    }

    return res.json({ message: "If matching signature exists inside our guild registries, a reset code has been dispatched." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Verification token and new credentials signature required." });

  try {
    const hashedPassword = await hashPassword(newPassword);

    if (isProductionDB) {
      const prisma = getPrisma();
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpires: { gt: new Date() }
        }
      });

      if (!user) return res.status(400).json({ error: "Reset signature invalid or expired." });

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: hashedPassword, resetToken: null, resetTokenExpires: null }
      });
    } else {
      const db = readLocalDB();
      const user = db.users.find((u: any) => u.resetToken === token && new Date(u.resetTokenExpires) > new Date());

      if (!user) return res.status(400).json({ error: "Reset signature invalid or expired." });

      user.passwordHash = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
      writeLocalDB(db);
    }

    return res.json({ message: "Credentials rebuilt successfully. Proceed to login." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. PRODUCTS API & ADVANCED SEARCH
// ==========================================

router.get("/products", async (req, res) => {
  const { category, creator, country, material, minPrice, maxPrice, sortBy } = req.query;

  try {
    let list: any[] = [];
    if (isProductionDB) {
      list = await getPrisma().product.findMany({ include: { artist: true } });
    } else {
      list = readLocalDB().products;
    }

    // Advanced search multi-filtering
    let filtered = [...list];

    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (creator) {
      filtered = filtered.filter(p => p.artistName.toLowerCase().includes((creator as string).toLowerCase()));
    }
    if (country) {
      // Look up artist country if joined or inside object
      filtered = filtered.filter(p => {
        const countryStr = p.creatorCountry || p.artist?.country || "";
        return countryStr.toLowerCase().includes((country as string).toLowerCase());
      });
    }
    if (material) {
      filtered = filtered.filter(p => 
        p.materials?.some((m: string) => m.toLowerCase().includes((material as string).toLowerCase()))
      );
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice as string));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice as string));
    }

    // Sort processing
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return res.json(filtered);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/products", requireAuth, requireRole(["CREATOR", "ADMIN"]), async (req: AuthenticatedRequest, res) => {
  const { title, description, imageUrl, price, category, materials, dimensions, inspiration, productionTime, storyText } = req.body;
  if (!title || !price || !category || !imageUrl) {
    return res.status(400).json({ error: "Missing required product credentials (title, price, category, imageUrl)." });
  }

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.user!.userId } });
      if (!profile) return res.status(400).json({ error: "Associated Artisan profile records not found." });

      const newProd = await prisma.product.create({
        data: {
          title,
          description: description || "Slow craft piece under curated signature.",
          imageUrl,
          price: parseFloat(price),
          category,
          materials: materials || [],
          dimensions,
          artistId: profile.id,
          artistName: profile.name,
          inspiration,
          productionTime,
          storyText
        }
      });
      return res.status(201).json(newProd);
    } else {
      const db = readLocalDB();
      const profile = db.creatorProfiles.find((c: any) => c.userId === req.user!.userId);
      if (!profile) return res.status(400).json({ error: "Associated Artisan profile records not found." });

      const newProd = {
        id: generateId("prod"),
        title,
        description: description || "Slow craft piece under curated signature.",
        imageUrl,
        price: parseFloat(price),
        category,
        materials: Array.isArray(materials) ? materials : [materials],
        dimensions,
        artistId: profile.id,
        artistName: profile.name,
        artistAvatar: profile.avatarUrl,
        rating: 5.0,
        reviewsCount: 0,
        inspiration,
        productionTime,
        storyText,
        createdAt: new Date().toISOString()
      };

      db.products.push(newProd);
      writeLocalDB(db);
      return res.status(201).json(newProd);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/products/:id", requireAuth, requireRole(["CREATOR", "ADMIN"]), async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const prod = await prisma.product.findUnique({ where: { id } });
      if (!prod) return res.status(404).json({ error: "Art piece not found." });

      // If user is creator, ensure they own the piece
      if (req.user!.role === "CREATOR") {
        const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.user!.userId } });
        if (!profile || prod.artistId !== profile.id) {
          return res.status(403).json({ error: "Access denied. You cannot burn another artisan's inventory." });
        }
      }

      await prisma.product.delete({ where: { id } });
    } else {
      const db = readLocalDB();
      const idx = db.products.findIndex((p: any) => p.id === id);
      if (idx === -1) return res.status(404).json({ error: "Art piece not found." });

      if (req.user!.role === "CREATOR") {
        const profile = db.creatorProfiles.find((c: any) => c.userId === req.user!.userId);
        if (!profile || db.products[idx].artistId !== profile.id) {
          return res.status(403).json({ error: "Access denied. You cannot burn another artisan's inventory." });
        }
      }

      db.products.splice(idx, 1);
      writeLocalDB(db);
    }
    return res.json({ message: "Product burnt successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. CATEGORIES API
// ==========================================
router.get("/categories", async (req, res) => {
  try {
    if (isProductionDB) {
      const cats = await getPrisma().category.findMany();
      return res.json(cats);
    } else {
      return res.json(readLocalDB().categories);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/categories", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const { name, imageUrl } = req.body;
  if (!name) return res.status(400).json({ error: "Category name required." });
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  try {
    if (isProductionDB) {
      const cat = await getPrisma().category.create({ data: { name, slug, imageUrl } });
      return res.status(201).json(cat);
    } else {
      const db = readLocalDB();
      const newCat = { id: generateId("cat"), name, slug, imageUrl };
      db.categories.push(newCat);
      writeLocalDB(db);
      return res.status(201).json(newCat);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. ORDERS & PAYMENTS API
// ==========================================

router.get("/orders", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (isProductionDB) {
      const orders = await getPrisma().order.findMany({
        where: req.user!.role === "ADMIN" ? {} : { userId: req.user!.userId },
        include: { items: { include: { product: true } } }
      });
      return res.json(orders);
    } else {
      const db = readLocalDB();
      const userOrders = req.user!.role === "ADMIN" 
        ? db.orders 
        : db.orders.filter((o: any) => o.userId === req.user!.userId);
      return res.json(userOrders);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/orders", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { items, shippingAddress, paymentMethod } = req.body; // items: [{ productId, quantity, price }]
  if (!items || !items.length || !shippingAddress) {
    return res.status(400).json({ error: "Items collection and delivery address are mandatory." });
  }

  try {
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const orderId = generateId("order");

    if (isProductionDB) {
      const prisma = getPrisma();
      const order = await prisma.order.create({
        data: {
          id: orderId,
          userId: req.user!.userId,
          status: "PAID",
          totalAmount,
          shippingAddress,
          items: {
            create: items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.price
            }))
          },
          payments: {
            create: {
              amount: totalAmount,
              status: "SUCCESS",
              paymentMethod: paymentMethod || "CARD",
              transactionId: generateId("tx")
            }
          }
        },
        include: { user: true }
      });

      // Dispatch order confirmation email
      await sendEmail(order.user.email, "Guild Acquisition Confirmed", getOrderConfirmationEmail(order.user.name, order.id, totalAmount));
      return res.status(201).json(order);
    } else {
      const db = readLocalDB();
      const userObj = db.users.find((u: any) => u.id === req.user!.userId);

      const newOrder = {
        id: orderId,
        userId: req.user!.userId,
        status: "Paid",
        totalAmount,
        shippingAddress,
        items,
        createdAt: new Date().toISOString()
      };

      db.orders.push(newOrder);
      db.payments.push({
        id: generateId("pay"),
        orderId,
        amount: totalAmount,
        status: "SUCCESS",
        paymentMethod: paymentMethod || "CARD",
        transactionId: generateId("tx"),
        createdAt: new Date().toISOString()
      });

      // Create a notification
      db.notifications.push({
        id: generateId("notif"),
        userId: req.user!.userId,
        type: "ORDER",
        title: "Acquisition Paid",
        message: `Your premium acquisition ${orderId} of value $${totalAmount} has been registered inside Artora vaults.`,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      writeLocalDB(db);

      if (userObj) {
        await sendEmail(userObj.email, "Guild Acquisition Confirmed", getOrderConfirmationEmail(userObj.name, orderId, totalAmount));
      }

      return res.status(201).json(newOrder);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.patch("/orders/:id/status", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = req.body; // "SHIPPED" or "DELIVERED" etc

  try {
    let order: any = null;
    let targetUser: any = null;

    if (isProductionDB) {
      const prisma = getPrisma();
      order = await prisma.order.update({
        where: { id },
        data: { status },
        include: { user: true }
      });
      targetUser = order.user;
    } else {
      const db = readLocalDB();
      const idx = db.orders.findIndex((o: any) => o.id === id);
      if (idx === -1) return res.status(404).json({ error: "Order record not found." });

      db.orders[idx].status = status;
      order = db.orders[idx];
      targetUser = db.users.find((u: any) => u.id === order.userId);
      writeLocalDB(db);
    }

    // Trigger emails based on new status
    if (targetUser) {
      if (status.toUpperCase() === "SHIPPED") {
        await sendEmail(targetUser.email, "Your Artora Acquisition Has Shipped", getOrderShippedEmail(targetUser.name, id));
      } else if (status.toUpperCase() === "DELIVERED") {
        await sendEmail(targetUser.email, "Your Acquisition Has Been Delivered", getOrderDeliveredEmail(targetUser.name, id));
      }
    }

    return res.json({ message: "Order status modified.", order });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. REVIEWS API
// ==========================================

router.get("/reviews", async (req, res) => {
  const { productId } = req.query;
  try {
    if (isProductionDB) {
      const list = await getPrisma().review.findMany({
        where: productId ? { productId: productId as string } : {}
      });
      return res.json(list);
    } else {
      const db = readLocalDB();
      const list = productId 
        ? db.reviews.filter((r: any) => r.productId === productId)
        : db.reviews;
      return res.json(list);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/reviews", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { productId, rating, comment, imageUrl } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: "Missing required review parameters (productId, rating, comment)." });
  }

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
      if (!user) return res.status(404).json({ error: "Collector entity not found." });

      const review = await prisma.review.create({
        data: {
          productId,
          buyerName: user.name,
          buyerAvatar: user.avatarUrl,
          rating: parseInt(rating),
          comment,
          imageUrl,
          date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })
        }
      });

      // Recalculate average rating of product
      const allReviews = await prisma.review.findMany({ where: { productId } });
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await prisma.product.update({
        where: { id: productId },
        data: { rating: avg, reviewsCount: allReviews.length }
      });

      return res.status(201).json(review);
    } else {
      const db = readLocalDB();
      const user = db.users.find((u: any) => u.id === req.user!.userId);
      if (!user) return res.status(404).json({ error: "Collector entity not found." });

      const review = {
        id: generateId("rev"),
        productId,
        buyerName: user.name,
        buyerAvatar: user.avatarUrl,
        rating: parseInt(rating),
        comment,
        imageUrl,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }),
        createdAt: new Date().toISOString()
      };

      db.reviews.push(review);

      // Recalculate average rating
      const allReviews = db.reviews.filter((r: any) => r.productId === productId);
      const avg = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;
      
      const pIdx = db.products.findIndex((p: any) => p.id === productId);
      if (pIdx !== -1) {
        db.products[pIdx].rating = Math.round(avg * 10) / 10;
        db.products[pIdx].reviewsCount = allReviews.length;
      }

      writeLocalDB(db);
      return res.status(201).json(review);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/reviews/:id/reply", requireAuth, requireRole(["CREATOR", "ADMIN"]), async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { replyText } = req.body;
  if (!replyText) return res.status(400).json({ error: "Reply text is mandatory." });

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const review = await prisma.review.update({
        where: { id },
        data: { creatorReply: replyText }
      });
      return res.json(review);
    } else {
      const db = readLocalDB();
      const idx = db.reviews.findIndex((r: any) => r.id === id);
      if (idx === -1) return res.status(404).json({ error: "Review not found." });

      db.reviews[idx].creatorReply = replyText;
      writeLocalDB(db);
      return res.json(db.reviews[idx]);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. MESSAGES API (MODERN MESSENGER)
// ==========================================

router.get("/messages/threads", requireAuth, async (req: AuthenticatedRequest, res) => {
  const email = req.user!.email;

  try {
    if (isProductionDB) {
      const list = await getPrisma().message.findMany({
        where: {
          OR: [{ senderId: email }, { receiverId: email }]
        },
        orderBy: { createdAt: "desc" }
      });
      return res.json(list);
    } else {
      const db = readLocalDB();
      const list = db.messages.filter((m: any) => m.senderId === email || m.receiverId === email);
      return res.json(list);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/messages", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { receiverId, text, imageUrl, productLink } = req.body;
  if (!receiverId || (!text && !imageUrl && !productLink)) {
    return res.status(400).json({ error: "Receiver signature and content payload required." });
  }

  const senderEmail = req.user!.email;
  const threadId = [senderEmail, receiverId].sort().join("_");
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const msg = await prisma.message.create({
        data: {
          senderId: senderEmail,
          receiverId,
          threadId,
          text: text || "",
          imageUrl,
          productLink,
          time: timeStr
        }
      });

      // Dispatch alert email to receiver
      const receiverUser = await prisma.user.findUnique({ where: { email: receiverId } });
      if (receiverUser) {
        await sendEmail(receiverId, "New Studio Transmission received", getNewMessageEmail(receiverUser.name, req.user!.name, text || "Sent an attachment."));
      }

      return res.status(201).json(msg);
    } else {
      const db = readLocalDB();
      const msg = {
        id: generateId("msg"),
        senderId: senderEmail,
        receiverId,
        threadId,
        text: text || "",
        imageUrl,
        productLink,
        time: timeStr,
        isRead: false,
        createdAt: new Date().toISOString()
      };

      db.messages.push(msg);

      // Create system notification for receiver if logged in or active
      const receiverUser = db.users.find((u: any) => u.email === receiverId);
      if (receiverUser) {
        db.notifications.push({
          id: generateId("notif"),
          userId: receiverUser.id,
          type: "MESSAGE",
          title: `Transmission from ${req.user!.name}`,
          message: text || "Sent an attachment.",
          isRead: false,
          createdAt: new Date().toISOString()
        });

        await sendEmail(receiverId, "New Studio Transmission received", getNewMessageEmail(receiverUser.name, req.user!.name, text || "Sent an attachment."));
      }

      writeLocalDB(db);
      return res.status(201).json(msg);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. NOTIFICATIONS API
// ==========================================

router.get("/notifications", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (isProductionDB) {
      const list = await getPrisma().notification.findMany({
        where: { userId: req.user!.userId },
        orderBy: { createdAt: "desc" }
      });
      return res.json(list);
    } else {
      const db = readLocalDB();
      const list = db.notifications.filter((n: any) => n.userId === req.user!.userId);
      return res.json(list);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/notifications/read-all", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (isProductionDB) {
      await getPrisma().notification.updateMany({
        where: { userId: req.user!.userId },
        data: { isRead: true }
      });
    } else {
      const db = readLocalDB();
      db.notifications.forEach((n: any) => {
        if (n.userId === req.user!.userId) {
          n.isRead = true;
        }
      });
      writeLocalDB(db);
    }
    return res.json({ message: "All transmissions marked read." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. CREATORS & CODES
// ==========================================

router.get("/creators", async (req, res) => {
  try {
    if (isProductionDB) {
      const list = await getPrisma().creatorProfile.findMany({ include: { user: true } });
      return res.json(list);
    } else {
      return res.json(readLocalDB().creatorProfiles);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/creators/approve", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const { creatorId, badgeLevel } = req.body; // badgeLevel: "VERIFIED", "FEATURED", "ELITE"
  if (!creatorId || !badgeLevel) return res.status(400).json({ error: "Artisan profile identification and level badge code required." });

  try {
    if (isProductionDB) {
      const updated = await getPrisma().creatorProfile.update({
        where: { id: creatorId },
        data: { badgeLevel }
      });
      return res.json(updated);
    } else {
      const db = readLocalDB();
      const idx = db.creatorProfiles.findIndex((c: any) => c.id === creatorId);
      if (idx === -1) return res.status(404).json({ error: "Creator profile not found." });

      db.creatorProfiles[idx].badgeLevel = badgeLevel;
      writeLocalDB(db);
      return res.json(db.creatorProfiles[idx]);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. FOLLOWERS SYSTEM
// ==========================================

router.post("/followers/toggle", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { creatorId } = req.body; // The user ID of the creator
  if (!creatorId) return res.status(400).json({ error: "Target creator ID required." });

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const existing = await prisma.follower.findUnique({
        where: {
          followerId_creatorId: {
            followerId: req.user!.userId,
            creatorId
          }
        }
      });

      if (existing) {
        await prisma.follower.delete({ where: { id: existing.id } });
        
        // Decrement followersCount
        await prisma.creatorProfile.update({
          where: { userId: creatorId },
          data: { followersCount: { decrement: 1 } }
        });

        return res.json({ following: false });
      } else {
        await prisma.follower.create({
          data: {
            followerId: req.user!.userId,
            creatorId
          }
        });

        // Increment followersCount
        const profile = await prisma.creatorProfile.update({
          where: { userId: creatorId },
          data: { followersCount: { increment: 1 } },
          include: { user: true }
        });

        // Trigger notification & email alert
        if (profile.user) {
          await sendEmail(profile.user.email, "New Guild Follower Registered", getNewFollowerEmail(profile.name, req.user!.name));
        }

        return res.json({ following: true });
      }
    } else {
      const db = readLocalDB();
      const existingIdx = db.followers.findIndex((f: any) => f.followerId === req.user!.userId && f.creatorId === creatorId);

      if (existingIdx !== -1) {
        db.followers.splice(existingIdx, 1);
        
        // Decrement follower count
        const profIdx = db.creatorProfiles.findIndex((c: any) => c.userId === creatorId || c.id === creatorId);
        if (profIdx !== -1) {
          db.creatorProfiles[profIdx].followersCount = Math.max(0, db.creatorProfiles[profIdx].followersCount - 1);
        }

        writeLocalDB(db);
        return res.json({ following: false });
      } else {
        db.followers.push({
          id: generateId("follow"),
          followerId: req.user!.userId,
          creatorId
        });

        // Increment follower count
        const profIdx = db.creatorProfiles.findIndex((c: any) => c.userId === creatorId || c.id === creatorId);
        let creatorName = "Creator";
        let creatorEmail = "";
        if (profIdx !== -1) {
          db.creatorProfiles[profIdx].followersCount += 1;
          creatorName = db.creatorProfiles[profIdx].name;
          
          const creatorUserObj = db.users.find((u: any) => u.id === db.creatorProfiles[profIdx].userId);
          if (creatorUserObj) {
            creatorEmail = creatorUserObj.email;
          }
        }

        // Add creator notification
        const creatorUser = db.users.find((u: any) => u.id === creatorId || u.name === creatorName);
        if (creatorUser) {
          db.notifications.push({
            id: generateId("notif"),
            userId: creatorUser.id,
            type: "FOLLOWER",
            title: "New Follower",
            message: `${req.user!.name} is now tracking your workshop journal.`,
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }

        writeLocalDB(db);

        if (creatorEmail) {
          await sendEmail(creatorEmail, "New Guild Follower Registered", getNewFollowerEmail(creatorName, req.user!.name));
        }

        return res.json({ following: true });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 10. WISHLIST API
// ==========================================

router.post("/wishlist/toggle", requireAuth, async (req: AuthenticatedRequest, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: "Product ID required." });

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const existing = await prisma.wishlist.findUnique({
        where: {
          userId_productId: {
            userId: req.user!.userId,
            productId
          }
        }
      });

      if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } });
        return res.json({ wishlisted: false });
      } else {
        await prisma.wishlist.create({
          data: { userId: req.user!.userId, productId }
        });
        return res.json({ wishlisted: true });
      }
    } else {
      const db = readLocalDB();
      const existingIdx = db.wishlists.findIndex((w: any) => w.userId === req.user!.userId && w.productId === productId);

      if (existingIdx !== -1) {
        db.wishlists.splice(existingIdx, 1);
        writeLocalDB(db);
        return res.json({ wishlisted: false });
      } else {
        db.wishlists.push({
          id: generateId("wish"),
          userId: req.user!.userId,
          productId
        });
        writeLocalDB(db);
        return res.json({ wishlisted: true });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 11. CREATOR JOURNAL API
// ==========================================

router.get("/journals", async (req, res) => {
  try {
    if (isProductionDB) {
      const list = await getPrisma().creatorJournal.findMany({
        include: { creator: true },
        orderBy: { createdAt: "desc" }
      });
      return res.json(list);
    } else {
      return res.json(readLocalDB().journals);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/journals", requireAuth, requireRole(["CREATOR", "ADMIN"]), async (req: AuthenticatedRequest, res) => {
  const { title, story, photoUrl, videoUrl } = req.body;
  if (!title || !story) return res.status(400).json({ error: "Title and story content required." });

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.user!.userId } });
      if (!profile) return res.status(404).json({ error: "Creator profile not found." });

      const post = await prisma.creatorJournal.create({
        data: {
          creatorId: profile.id,
          title,
          story,
          photoUrl,
          videoUrl,
        }
      });
      return res.status(201).json(post);
    } else {
      const db = readLocalDB();
      const profile = db.creatorProfiles.find((c: any) => c.userId === req.user!.userId);
      if (!profile) return res.status(404).json({ error: "Creator profile not found." });

      const post = {
        id: generateId("j"),
        creatorId: profile.id,
        title,
        story,
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
        videoUrl,
        likes: 0,
        comments: [],
        isSaved: false,
        createdAt: new Date().toISOString()
      };

      db.journals.unshift(post);
      writeLocalDB(db);
      return res.status(201).json(post);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 12. COLLECTIONS API
// ==========================================

router.get("/collections", async (req, res) => {
  try {
    if (isProductionDB) {
      const cols = await getPrisma().collection.findMany({
        include: { products: { include: { product: true } } }
      });
      return res.json(cols);
    } else {
      return res.json(readLocalDB().collections);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/collections", requireAuth, requireRole(["CREATOR", "ADMIN"]), async (req: AuthenticatedRequest, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Collection name required." });

  try {
    if (isProductionDB) {
      const prisma = getPrisma();
      const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.user!.userId } });
      if (!profile) return res.status(404).json({ error: "Creator profile not found." });

      const col = await prisma.collection.create({
        data: {
          creatorId: profile.id,
          name,
          description: description || "Artora Curated Collection series."
        }
      });
      return res.status(201).json(col);
    } else {
      const db = readLocalDB();
      const profile = db.creatorProfiles.find((c: any) => c.userId === req.user!.userId);
      if (!profile) return res.status(404).json({ error: "Creator profile not found." });

      const col = {
        id: generateId("col"),
        creatorId: profile.id,
        name,
        description: description || "Artora Curated Collection series.",
        createdAt: new Date().toISOString()
      };

      db.collections.push(col);
      writeLocalDB(db);
      return res.status(201).json(col);
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 13. ADMIN PANEL CONTROL ENDPOINTS
// ==========================================

router.get("/admin/reports", requireAuth, requireRole(["ADMIN"]), (req, res) => {
  try {
    const db = readLocalDB();
    return res.json(db.reports || []);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/admin/suspend-user", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const { userId, suspend } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID is required." });

  try {
    const db = readLocalDB();
    const user = db.users.find((u: any) => u.id === userId);
    if (!user) return res.status(404).json({ error: "User profile not found." });

    user.role = suspend ? "SUSPENDED" : "USER";
    writeLocalDB(db);

    return res.json({ message: `User account has been successfully ${suspend ? "SUSPENDED" : "RESTORED"}.` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
