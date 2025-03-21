# MvC2 System

## 100% Technique Explanation

*(all URLs are broken)*

---

### **Briefing & Skipping**

### **100% Execution of Combos**

There is a way to ensure that the programmable controller will execute a combo **100% of the time**. This method also lets you identify when certain **attacks**, **combos**, or **situations** won’t work.

> **Key Issue:**
> Until now, programmable pads would sometimes "mess up" the combo or situation they were told to execute.

However, **programmable controllers are flawless**; the inconsistency lies in the video game itself, which isn’t truly running at **60 frames per second** (fps).

---

### **Calibration is Key**

To get accurate results every time, the programmable controller must be **calibrated** before executing the main combo or situation.

- **How It Works:**
   1. Insert a sequence **before** the actual combo (referred to as the "100% sequence").
   2. The 100% sequence and the actual combo are combined into one overall sequence.

This tool is especially valuable for **complicated** and **elaborate** combos that often have low success rates (e.g., less than **10%**). It’s also incredibly useful for testing **short but intricate strings**.

---

### **Understanding Frame Skipping in MvC2**

Before diving into the technique, it’s important to understand how MvC2 works in terms of **frame skipping**:

- On **Normal Speed**, MvC2 runs at **72 frames per second**.
- Switching to **Turbo** speed forces the game to skip frames.

**Example Frame Cycle (Turbo):**
`1, 2, 3,  *5*, 6, 7, 8, *10*, 11 ...`

- The game **displays** three consecutive frames and then skips one.
- The skipped frame is **inaccessible**. If a **just-frame** (an action that requires perfect timing) occurs on the skipped frame, it **won’t be registered**.

---

### **When Does Frame Skipping Start?**

- The **frame-skipping cycle** begins as soon as you:
  - **Turn on the Dreamcast (DC)** or
  - **Complete a loading screen.**

---

### **Effects on Gameplay**

1. Frame skipping **does not affect inputs** during a normal match.
2. However, it *can* occasionally cause **errors**, particularly with:
   - Timing of **reversals** (most common)
   - Combos (rarely affected)

> **Note:** These errors are uncommon but can disrupt precision in specific scenarios.

---

### **Why Frame Skipping Matters**

- To achieve **100% consistency**, you need to account for skipped frames.
- The calibration process ensures the programmable controller aligns with the game’s **frame cycle**, avoiding timing errors.

---

### **First Method - Using Triangle Jumps**

There are a few ways to calibrate the programmable pad (**ppad**). One method involves having the character perform a **triangle jump** as fast as possible. 

---

### **Challenges with Triangle Jumps**

- You’ll need to perform the triangle jump **twice in a row** (explained below).
- **Not all characters** in the game have a triangle jump.

The reason for performing the triangle jump twice is due to how the **frame sequence timing** works. The sequence may result in a **half-frame alignment (0.5)**. To confirm the correct frame, you must observe the triangle jump **happening twice in a row**.

---

### **Magneto's Triangle Jump Example**

Here’s Magneto performing a triangle jump twice, showing the displayed and skipped frames in the sequence:

d = displayed, s = skipped

```md
s---d---d---d---s---d---d---d---s---d---d---d---s---d---d---d---s---d---d---d---s---d---d---d---s---d---d---d---s---d---d---d---s

n---2---8---8---8---8---8---8---2pp---n---hp---hp---hp---hp---2---8---8---8---8---8---8---8---2pp---n---hp---hp---hp---hp---n
```

---

### **Validating the Sequence**

After performing the triangle jump, you need to validate the sequence by adding another **just-frame move**. For this example, we’ll use Magneto's **Tempest Super**.

---

### **Executing Magneto’s Tempest Super**

To execute Magneto’s Tempest move, a **fake tiger-knee motion** is performed, with the **UF (Up-Forward)** portion of the input held for **3 frames**.

- **Input Timing Rules:**
  - If UF is held for **1-2 frames**, Magneto will **not leave the ground**.
  - If UF is held for **4 or more frames**, Magneto will **leave the ground 100% of the time**.
  - If UF is held for **3 frames**, there is a **75% chance** he will leave the ground, and the special/super move won’t activate.
    - If Magneto stays grounded, it indicates you are on the **correct frame**.

---

### **Tempest Sequence**

Below is the frame sequence for Magneto’s Tempest move following the 100% sequence:

```md
d---s---d---d---d---s---d---d---d---d
n---n---n---2---1---4---7---7---7---kk
```

- Since only **2 frames** are displayed during the super jump, Magneto stays grounded and successfully performs the special/super.

---

### **Key Takeaway**

This method ensures frame alignment for calibration but requires observation and precision when performing the triangle jumps and following up with just-frame moves.

---

### **Second Method - Using Fake Tiger-Knees**

The second method for adjusting the programmable pad to the game’s frame cycle is the **fake tiger-knee method**. While it produces the same result as triangle jumps, the process can range from **moderately unpleasant** to **downright annoying**.

---

**Why Use This Method?**
Since ensuring that moves execute **100% of the time** is critical in some cases, this technique becomes a **necessity** despite its challenges.

For example, Magneto can perform:

- A **tiger-knee Hypergrav**
- Followed by a **tiger-knee Tempest**

If the Tempest is attempted **one frame too early**, it will:

1. Throw off the frame cycle
2. Cause the move to fail

---

**Challenges with Fake Tiger-Knees**

1. **Super-Jumping Issue:**
   - **75% of the time**, the input results in a **super-jump** instead of the desired move.
   - This forces you to reposition the character(s) and try again.

2. **Impact on Specific Health Situations:**
   - Some characters’ specials can hit the opponent, disrupting scenarios where specific health values are important.
   - For example, **Storm** can perform her lightning attack facing **backwards** to avoid hitting the opponent. However, even this workaround results in her super-jumping **75% of the time**.

---

**Key Takeaway**
While the fake tiger-knee method is effective, its **high failure rate** and **tedious setup** make it less favorable compared to other methods. Still, it remains a viable solution in situations where **precision is non-negotiable**.

---

### **Third Method - Using Normals**

The third method is by far the **least time-consuming** and was the most commonly used. This method was discovered by **joo**, who analyzed the **length of character normals** to determine which ones would yield the desired results.

---

**How It Works**
Using specific normals, you can align the programmable pad to the game’s frame cycle. This involves finding moves with durations that, when divided by **4**, result in a number ending in **.25** or one-fourth. These values are optimal for calibration.

---

**Why .25 Matters**

- **.25** is the **smallest probability unit** in the game’s frame system.
- Using moves with lengths that result in **.25** ensures that the calibration process is faster and more reliable.
- If you use a number ending in **.5** (e.g., 3.5), the process will still work, but it will require **two repeats** to narrow down the frame.

---

**Example: Comparing Frame Lengths**

- A move that is **14 frames** most of the time but sometimes registers as **13 frames**:
  - \( 13 ÷ 4 = 3.25 \) → **Ideal for calibration**

- A move that is **15 frames** most of the time but sometimes registers as **14 frames**:
  - \( 14 ÷ 4 = 3.5 \) → **Requires two consecutive results** to confirm alignment.

---

**Key Frame Lengths for Calibration**

The following numbers are optimal for calibration because subtracting **1** and dividing by **4** results in **.25**:
`6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54`

**Breakdown Example:**

- \( 14 ÷ 4 = 3.5 \) (problematic, requires two cycles)
- \( 13 ÷ 4 = 3.25 \) (ideal)

---

**Special Considerations**

While this method works for most characters, there are some **caveats**:

1. Some characters do not have normals with the required frame durations.
   - For example, **Ryu** can perform **S.LK, S.LP** twice to calibrate.
2. **Taunts** can also be used for calibration:
   - Two characters have taunts that are **54 frames**, and **53 frames 25% of the time**.
   - Even these taunts can be used for accurate calibration.

---

**Why This Method is Effective**
This method is faster and more reliable because **every character** has at least one combination of normals that can be used for calibration. It avoids many of the issues associated with triangle jumps or fake tiger-knees.

---

### **Pausing**

One important aspect of using the **100% technique** is that you can actually control the **frame skipping cycle** the game produces. 

---

**How the Frame Skipping Cycle Works**

- The game’s frame skipping cycle remains **fixed** until you:
  - **Pause the game**
  - **Change levels**
  - **Restart the game**

If you execute a **complicated sequence** without a 100% sequence beforehand, pausing the game will **not affect** the outcome. However, if you’re using a **100% sequence** before your combo and you pause the game, chances are the sequence will **no longer work 100% of the time**.

---

**A Learning Experience**

I learned this the hard way when attempting to execute a sequence that wouldn’t work **100% of the time**.
1. At first, I assumed the problem was caused by incorrect wait times (variables 1-4).
2. I paused the game to change speeds, thinking this was the only way to restart the frame cycle.
3. When this didn’t work, I paused again and reattempted the sequence after adjusting the variables.

Eventually, I realized that simply **pausing and unpausing** the game was enough to reset the frame skipping cycle. **Pausing greatly increases your chances** of landing on the correct frame and successfully executing sequences in MvC2.

---

**Practical Use of Pausing**

If the frame cycle is set and you’re using the 100% technique, there’s a chance you’ve landed on a **skipped frame**, which prevents your combo from working consistently. 

**Solution:**
Insert a pause for a few frames and unpause on a specific frame to restart the cycle. This allows for different results in sequences that rely on the **100% technique**.

---

**Frame Details for Pausing**
To insert a pause into a technique:
1. Pause the game for **4 frames** total:
   - **3 frames of neutral**
   - **1 frame of unpause**
2. This changes the frame cycle, enabling different results.

This approach allows for **crazy and elaborate combos**, though there is one drawback:

- Pausing causes in-game voices to **mute**, which isn’t a major issue but worth noting.

---

**Example: Sentinel’s cr.hp Unblockable**
Below is an example of Sentinel performing his **cr.hp unblockable on Zangief**:

- One instance uses the pause before the 100% sequence.
- The other does not.

The pause makes a noticeable difference in consistency and timing for this sequence.

### **Conclusion**

That’s everything I know about the **100% technique** and how it works. This technique is **incredibly useful** for programming **elaborate combos** and achieving consistent results. However, it does have its limitations:

---

**Limitations of the 100% Technique**

1. **Randomness in Throws**  
   - **Throws** can sometimes do absurd amounts of damage if mashed correctly, but other times they won’t—**even if mashed the same way**.  
   - My guess is that this randomness is embedded somewhere in the game’s programming and might truly be random.

2. **Randomness in Supers and Specials**  
   - Mashing for **supers** or **specials** cannot be controlled, which is disappointing.  
   - For example:  
     - **AHVB (Air Hyper Viper Beam)**  
     - **Silver Samurai’s Lightning Super**  
   - These are moments where control would be beneficial but isn’t possible.

---

**Randomness from Game Slowdowns**  
Another kind of randomness stems from the game **slowing down** during certain stages, causing **ST-esque errors** that don’t make sense.

- These errors are particularly noticeable during intense moments like:  
  - **Calling assists**  
  - **DHCs (Delayed Hyper Combos)**  

This makes **emulation** an interesting subject. With a super-powerful PC capable of running emulators that perfectly mimic the **Dreamcast (DC)** hardware:

- You wouldn’t experience the **random slowdowns** from normal matches.  
- However, this would also remove some useful (for combos) bugs and quirks present in the original game.  

---

**Emulators and Their Tools**

Emulators often include tools like:

- **Macros**  
- **Save states**

While these tools eliminate randomness from mashing and supers, they also strip away some of the game’s unique quirks. For example, mashing and random supers wouldn’t be random anymore because save states allow you to retry frames with precision.

---

**Final Thoughts**

Despite its quirks and limitations, the **100% technique** is an essential tool for anyone trying to master Marvel vs. Capcom 2. While I don’t have much hope for emulators solving these issues, the technique remains invaluable for programming consistent combos.

---

**Special Thanks**

- **ECZangief**
- **Joo**
- **Majestros**

---

**100% Technique Table**


| **Character**          | **Sequence**                   |
|------------------------|--------------------------------|
| Akuma                  | 2lp9/lk21                      |
| Amingo                 | 3hk21/lp21                     |
| Anakaris               | lp17/lk21                      |
| B.B. Hood              | lk13/lp21                      |
| Blackheart             | 2lp9/lk21                      |
| Cable                  | lk+start53/lp21                |
| Cammy                  | hp25/lp21                      |
| Captain America        | lp13/lk21                      |
| Captain Commando       | 2hp33/lk21                     |
| Charlie                | lp9/lk21                       |
| Chun-Li                | lk13/lp21                      |
| Colossus               | 2hk29/lk21                     |
| Cyclops                | lp13/lk21                      |
| Dan                    | 2lp9/lk21                      |
| Dhalsim                | 2lp13/lk21                     |
| Doctor Doom            | lp13/lk21                      |
| Felicia                | 2lp9/lk21                      |
| Gambit                 | 2hp29/lp21                     |
| Guile                  | 2lp9/lk21                      |
| Hayato                 | 4hp17/lp21                     |
| Hulk                   | lk+start53/lp21                |
| Iceman                 | lp13/lk21                      |
| Iron Man               | lk13/lp21                      |
| Jill                   | lk13/lp21                      |
| Jin                    | lk37/lp21                      |
| Juggernaut             | 2lk21/lp21                     |
| Ken                    | hk33/lp21                      |
| M. Bison               | 2lp9/lk21                      |
| Magneto                | 2lp14/lk21/2lp14/lk23          |
| Marrow                 | 2lp14/lk13/2lp14/lk21          |
| Megaman                | 3hk25/lk21                     |
| Morrigan               | lk9/lp21                       |
| Omega Red              | 2lp9/lk21                      |
| Psylocke               | lk17/lp21                      |
| Rogue                  | 2lk18/lp13/2lk18/lp21          |
| Roll                   | lp9/lk21                       |
| Ruby Heart             | 3hk37/lp21                     |
| Ryu                    | lk14/lp13/lk14/lp21            |
| Sabretooth             | hk29/lk21                      |
| Sakura                 | 2lk13/lp21                     |
| Sentinel               | 2lk25/lp21                     |
| Servbot                | 3hp37/lp21                     |
| Shuma-Gorath           | 2hp37/lk21                     |
| Silver Samurai         | lp22/lk25/lp22/lk25            |
| Sonson                 | 6hp34/lp21/6hp34/lp21          |
| Spider-Man             | 2lk13/lp21                     |
| Spiral                 | 2hp30/lp13/2hp30/lp21          |
| Storm                  | lp9/lk21                       |
| Strider Hiryu          | 2hp33/lk21                     |
| Thanos                 | lp17/lk21                      |
| Tron                   | lk37/lp21                      |
| Venom                  | lp13/lk21                      |
| War Machine            | 2lk18/lp13/2lk18/lp25          |
| Wolverine (Adamantium) | 2lp13/lk21                     |
| Wolverine (Bone)       | hk33/lk21                      |
| Zangief                | lp13/lk21                      |
