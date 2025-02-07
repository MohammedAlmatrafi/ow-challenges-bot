import os
import json
import urllib
import urllib.parse
from dotenv import load_dotenv
import discord
from discord.ext import commands
from discord import app_commands
import sqlite3
import base64

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

# Initialize bot with required intents
intents = discord.Intents.default()
intents.guilds = True
intents.guild_messages = True
intents.message_content = True  # Required to read message content
intents.voice_states = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

# Connect to the SQLite database
DB_PATH = os.path.join(os.path.dirname(__file__), 'challenges.db')

def initialize_database():
    """Initialize the database and create the table if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_challenges (
            server_id BIGINT NOT NULL,
            user_id BIGINT NOT NULL,
            challenges_attended INTEGER DEFAULT 0,
            challenges_won INTEGER DEFAULT 0,
            PRIMARY KEY (server_id, user_id)
        )
    """)
    conn.commit()
    conn.close()

initialize_database()

def get_challenge_stats(server_id, user_id):
    """Retrieve the challenge stats for a user in a specific server."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT challenges_attended, challenges_won
        FROM user_challenges
        WHERE server_id = ? AND user_id = ?
    """, (server_id, user_id))
    result = cursor.fetchone()
    conn.close()
    return result or (0, 0)  # Default to (0, 0) if no record exists

def initialize_user(server_id: int, user_id: int):
    """Initialize a user and insert them if they don't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR IGNORE INTO user_challenges (server_id, user_id)
        VALUES (?, ?);
    """, (server_id, user_id))
    conn.commit()
    conn.close()

def get_sorted_leaderboard(server_id, sort_by="challenges_won"):
    """Retrieve a sorted leaderboard for a specific server."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT user_id, challenges_attended, challenges_won
        FROM user_challenges
        WHERE server_id = ?
        ORDER BY {sort_by} DESC
    """, (server_id,))
    leaderboard = cursor.fetchall()
    conn.close()
    return leaderboard

def get_user_rank(server_id, user_id, sort_by="challenges_won"):
    """Get the rank of a specific user in the leaderboard."""
    leaderboard = get_sorted_leaderboard(server_id, sort_by)
    for rank, (uid, attended, won) in enumerate(leaderboard, start=1):
        if uid == user_id:
            return rank, attended, won
    return None, 0, 0  # User not found in the leaderboard

# GUILD_ID = discord.Object(id=1316972020466192517)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}!")
    try:
        # Sync the slash commands with Discord
        synced = await bot.tree.sync()
        print(f"Synced {len(synced)} command(s).")
        for guild in bot.guilds:
            for member in guild.members:
                initialize_user(guild.id, member.id)
    except Exception as e:
        print(f"Failed to sync commands: {e}")

# Define a slash command
@bot.tree.command(name="start", description="Start a challenge from the players in your current voice channel.")
async def start(interaction: discord.Interaction):
    # Check if the user is in a voice channel
    voice_channel = interaction.user.voice.channel if interaction.user.voice else None
    if not voice_channel:
        await interaction.response.send_message("You must be in a voice channel to use this command.", ephemeral=True)
        return

    # Get all members in the voice channel
    members = [
        {
            "n": member.global_name,
            "a": member.display_avatar.url,
            "t": "0",
            "c": False,
            "i": str(member.id)
        }
        for member in voice_channel.members
    ]

    # Send the list of members
    members_json = json.dumps(members)
    await interaction.response.send_message(
        f"Here is your Challenge link:\n[Click Here](https://zippy-dieffenbachia-81709a.netlify.app/?p={urllib.parse.quote(members_json)})", ephemeral=True
    )
    
# Define a slash command for selecting a user from the server
@bot.tree.command(name="rank", description="Get user stats in the challenges.")
async def select_user(interaction: discord.Interaction, user: discord.Member):
    # result = get_challenge_stats(interaction.guild.id, user.id)
    (rank, attended, won) = get_user_rank(interaction.guild.id, user.id)
    if(not rank):
        interaction.response.send_message('No user found')
    
    embed = discord.Embed(
        title=f"{"👑 " if rank == 1 else ""}{user.global_name} Stats",
        description=f"{user.mention} is the top {rank} player!",
        color=discord.Color.orange()
    )
    embed.set_thumbnail(url=user.display_avatar.url)  # Display the user's avatar
    embed.add_field(name="Total Challenges", value=attended, inline=True)
    embed.add_field(name="Total Wins", value=won, inline=True)
    embed.add_field(name="Win Rate", value=f"{0 if attended == 0 else round((won / attended) * 100)}%", inline=True)
    embed.add_field(name="USERID", value=user.id, inline=False)

    await interaction.response.send_message(embed=embed)

@bot.tree.command(name='leaderboard', description='Get the leaderboard of the top 10 players.')
async def get_leaderboard(interaction: discord.Interaction):
    server_id = interaction.guild.id

    # Get the sorted leaderboard (top 10 players)
    leaderboard = get_sorted_leaderboard(server_id)

    # Build the leaderboard message
    if not leaderboard:
        await interaction.response.send_message("No data available for the leaderboard.", ephemeral=True)
        return

    embed = discord.Embed(title="🏆 Leaderboard 🏆", color=discord.Color.orange())
    for rank, (user_id, attended, won) in enumerate(leaderboard, start=1):
        member = interaction.guild.get_member(user_id)
        username = member.display_name if member else f"User ID: {user_id}"
        rank_symbol = f"#{rank}"
        if rank == 1:
            rank_symbol = '🥇'
        if rank == 2:
            rank_symbol = '🥈'
        if rank == 3:
            rank_symbol = '🥉'
        embed.add_field(
            name=f"{rank_symbol} - {username}",
            value=f"Wins: {won}",
            inline=False
        )

    await interaction.response.send_message(embed=embed)

last_entered_command = None

@bot.tree.command(name='update', description='Update the database to include the latest results')
async def update_database(interaction: discord.Interaction, code:str):
    server_id = interaction.guild.id
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        code = base64.standard_b64decode(code).decode()
        global last_entered_command
        if(last_entered_command == code):
            raise SyntaxError('Changes already applied')
        last_entered_command = code
        users = code.split('|')
        for user in users:
            if(user.count('-') != 2):
                raise SyntaxError('Format error')
            (user_id, attended, won) = user.split('-')
            cursor.execute("""
            INSERT INTO user_challenges (server_id, user_id, challenges_attended, challenges_won)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(server_id, user_id) DO UPDATE SET
                challenges_attended = challenges_attended + ?,
                challenges_won = challenges_won + ?
            """, (server_id, user_id, attended, won, attended, won))
            
        conn.commit()
    except SyntaxError as e :
        await interaction.response.send_message(f'❌ Error: {e}.',ephemeral=True)
        return
    except Exception:
        await interaction.response.send_message(f'❌ Error: Wrong code.',ephemeral=True)
        return
    
    conn.close()    
    await interaction.response.send_message('Database updated ✅.',ephemeral=True)

# Run the bot with the token from the environment variable
bot.run(os.getenv("DISCORD_TOKEN"))